const db = require('../config/db.connect');

async function getAllEmployees() {
    try {
        const result = await db.query(`SELECT * FROM public.employees ORDER BY created_at DESC`);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function getEmployeeById(id) {
    try {
        const result = await db.query(`SELECT * FROM public.employees WHERE id = $1`, [id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function addEmployee(employee) {
     console.log('Employee Data ',employee);
    try {
        const query = `
            INSERT INTO public.employees (name, department, status)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const values = [
            employee.name,
            employee.department || null,
            employee.status || 'Active'
        ];
        const result = await db.query(query, values);
        console.log(result);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function updateEmployee(id, employee) {
    console.log('employee update =>', id,"  ",employee)
    try {
        const query = `
            UPDATE public.employees
            SET 
                name = $1,
                department = $2,
                status = $3
            WHERE id = $4
            RETURNING *`;
        const values = [
            employee.name,
            employee.department || null,
            employee.status || 'Active',
            id
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function deleteEmployee(id) {
    try {
        const result = await connection.query(`DELETE FROM public.employee WHERE id = $1 RETURNING *`, [id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllEmployees,
    getEmployeeById,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
