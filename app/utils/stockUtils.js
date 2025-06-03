const pool = require("../config/db.connect");
async function getOpeningAndClosingStock(productId, startDate, endDate) {
 
  const productResult = await pool.query(`SELECT 
          COALESCE(total_buy_quantity, 0) AS total_buy_quantity,  
          COALESCE(total_issue_quantity, 0) AS total_issue_quantity,
          COALESCE(total_buy_quantity, 0) - COALESCE(total_issue_quantity, 0) AS available_stock
    FROM products 
    WHERE id = $1`,
    [productId]
  );

  const product = productResult.rows[0];
  const totalBuyQty = product.total_buy_quantity;
  const totalIssueQty = product.total_issue_quantity;
  const available_stock = product.available_stock;

  // Calculate opening stock
  const openingStock = totalBuyQty - totalIssueQty;

  // Get issued quantity in the selected date range
  const periodIssues = await pool.query(
    `SELECT COALESCE(SUM(quantity), 0) AS total 
     FROM issues 
     WHERE product_id = $1 AND issue_date BETWEEN $2 AND $3`,
    [productId, startDate, endDate]
  );

  const issuedThisPeriod = periodIssues.rows[0].total;

  // Calculate closing stock
  const closingStock = openingStock - issuedThisPeriod;

  return { openingStock, closingStock };
}



module.exports = { getOpeningAndClosingStock };


