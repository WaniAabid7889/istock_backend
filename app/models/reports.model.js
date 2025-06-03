let connection = require("../config/db.connect");
const { getOpeningAndClosingStock } = require("../utils/stockUtils.js");
async function getIssuedProdQuantityMonthly(startDate, endDate) {
  const productResult = await connection.query(`
    SELECT DISTINCT p.name AS product_name 
    FROM issues i 
    INNER JOIN products p ON i.product_id = p.id
    WHERE i.issue_date BETWEEN $1 AND $2
  `,
    [startDate, endDate]
  );

  const products = productResult.rows.map((row) => row.product_name);

  const finalResult = [];
  for (const product of products) {
    const dailyResult = await connection.query(`
    SELECT 
      EXTRACT(DAY FROM i.issue_date)::int AS day,
      SUM(i.quantity)::int AS total,
      e.name AS employee_name,
      u.name AS issued_by
    FROM issues i
    INNER JOIN products p ON i.product_id = p.id
    LEFT JOIN employees e ON i.employee_id = e.id
    LEFT JOIN users u ON i.user_id = u.id
    WHERE p.name = $1 AND i.issue_date BETWEEN $2 AND $3
    GROUP BY day, e.name, u.name
    ORDER BY day
  `,
      [product, startDate, endDate]
    );

    console.log("dailyResult =>", dailyResult.rows);

    const dailyMap = {};
    const employeeNames = new Set();
    const issuedBys = new Set();

    // Sum quantity by day
    dailyResult.rows.forEach((row) => {
      dailyMap[row.day] = (dailyMap[row.day] || 0) + row.total;

      if (row.employee_name) employeeNames.add(row.employee_name);
      if (row.issued_by) issuedBys.add(row.issued_by);
    });

    console.log("dailyMap =>", dailyMap);

    // Build full daily array with summed totals
    const daysInMonth = new Date(
      startDate.split("-")[0],
      startDate.split("-")[1],
      0
    ).getDate();
    const dailyArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      dailyArray.push(dailyMap[i] || 0);
    }

    console.log("dailyArray =>", dailyArray);

    const productRow = await connection.query(
      `SELECT id FROM products WHERE name = $1 LIMIT 1`,
      [product]
    );

    const productId = productRow.rows[0]?.id;

    let opening = 0;
    let closing = 0;
    if (productId) {
      const stock = await getOpeningAndClosingStock(
        productId,
        startDate,
        endDate
      );
      opening = stock.openingStock;
      closing = stock.closingStock;
    }

    finalResult.push({
      product,
      opening_stock: opening,
      daily: dailyArray,
      closing_stock: closing,
      employee_name: Array.from(employeeNames).join(", ") || "N/A",
      issued_by: Array.from(issuedBys).join(", ") || "N/A",
    });
  }

  return finalResult;
}

async function getIssuedProdQuantityYearly(startDate, endDate) {
  const productResult = await connection.query(
    `
    SELECT DISTINCT p.name AS product_name 
    FROM issues i 
    INNER JOIN products p ON i.product_id = p.id
    WHERE i.issue_date BETWEEN $1 AND $2
  `,
    [startDate, endDate]
  );

  const products = productResult.rows.map((row) => row.product_name);
  const finalResult = [];

  for (const product of products) {
    const monthlyResult = await connection.query(
    `
      SELECT 
        EXTRACT(MONTH FROM i.issue_date)::int AS month,
        SUM(i.quantity)::int AS total,
        e.name AS employee_name,
        u.name AS issued_by
      FROM issues i
      INNER JOIN products p ON i.product_id = p.id
      LEFT JOIN employees e ON i.employee_id = e.id
      LEFT JOIN users u ON i.user_id = u.id
      WHERE p.name = $1 AND i.issue_date BETWEEN $2 AND $3
      GROUP BY month, e.name, u.name
      ORDER BY month
    `,
      [product, startDate, endDate]
    );

    const monthlyMap = {};
    const employeeNames = new Set();
    const issuedBys = new Set();

    // ✅ Sum total by month even if multiple employees
    monthlyResult.rows.forEach((row) => {
      monthlyMap[row.month] = (monthlyMap[row.month] || 0) + row.total;

      if (row.employee_name) employeeNames.add(row.employee_name);
      if (row.issued_by) issuedBys.add(row.issued_by);
    });

    const monthlyArray = [];
    for (let i = 1; i <= 12; i++) {
      monthlyArray.push(monthlyMap[i] || 0);
    }

    const productRow = await connection.query(
      `SELECT id FROM products WHERE name = $1 LIMIT 1`,
      [product]
    );

    const productId = productRow.rows[0]?.id;

    let opening = 0;
    let closing = 0;
    if (productId) {
      const stock = await getOpeningAndClosingStock(productId, startDate, endDate);
      opening = stock.openingStock;
      closing = stock.closingStock;
    }

    finalResult.push({
      product,
      opening_stock: opening,
      monthly: monthlyArray,
      closing_stock: closing,
      employee_name: Array.from(employeeNames).join(', ') || "N/A",
      issued_by: Array.from(issuedBys).join(', ') || "N/A",
    });
  }

  return finalResult;
}


async function InventoryReport(year) {
  try {
    const result = await connection.query(
      `
      SELECT 
        p.id,
        p.name,
        p.total_buy_quantity,
        p.total_issue_quantity,
        (p.total_buy_quantity - p.total_issue_quantity) AS closing_stock,
        COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM i.issue_date) = $1 THEN i.quantity ELSE 0 END), 0) AS issued_this_year,
        COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM i.issue_date) = $1 - 1 THEN i.quantity ELSE 0 END), 0) AS issued_last_year
      FROM products p
      LEFT JOIN issues i ON p.id = i.product_id
      GROUP BY p.id
      ORDER BY p.name ASC;
    `,
      [year]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching inventory report:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getDayWiseIssuedEmployees(product, month, day) {
  try {
    const result = await connection.query(
      `
            SELECT 
                e.name AS employee_name,
                SUM(i.quantity) AS total_issued
            FROM issues i
            INNER JOIN employees e ON i.employee_id = e.id
            INNER JOIN products p ON i.product_id = p.id
            WHERE EXTRACT(MONTH FROM i.issue_date) = $1
            AND EXTRACT(DAY FROM i.issue_date) = $2
            AND p.name = $3
            GROUP BY e.name
        `,
      [month, day, product]
    );

    return result.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  InventoryReport,
  getIssuedProdQuantityMonthly,
  getIssuedProdQuantityYearly,
  getDayWiseIssuedEmployees
};
