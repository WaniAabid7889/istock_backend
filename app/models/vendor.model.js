const connection = require('../config/db.connect.js');

async function getVendor() {
    try {
        const result = await connection.query(`
        SELECT vendor.*, branch.name AS branch_name from vendors vendor inner join branches branch on vendor.branch_id = branch.id
        `);
        return result.rows;
    }catch (error) {
       throw error;
    }
};

async function getVendorById(id) {
    console.log('Getting vendor by id', id)
    try {
        const result = await connection.query(` 
            SELECT 
            vendor.*, branch.name AS branch_name 
            from vendors vendor inner join branches branch on vendor.branch_id = branch.id WHERE vendor.id=$1
            ORDER BY branch.created_at DESC
            `,
            [id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

async function addVendor(vendor) {
    try {
        const result = await connection.query(`INSERT INTO public.vendors (name, gst_no, mobile, status,address,city,state,branch_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [vendor.name, vendor.gst_no, vendor.mobile, vendor.status, vendor.address, vendor.city, vendor.state, vendor.branch_id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function updateVendor(id, vendor) {
    console.log('Updating vendor', id, vendor)
    try {
        const result = await connection.query(`UPDATE public.vendors SET name=$1, gst_no=$2, mobile=$3, status=$4, address=$5, city=$6, state=$7, branch_id=$8 WHERE id=$9 RETURNING *`,
            [vendor.name, vendor.gst_no, vendor.mobile, vendor.status, vendor.address, vendor.city, vendor.state, vendor.branch_id, id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

async function deleteVendor(id) {
    try {
        const result = await connection.query(`DELETE FROM public.vendors WHERE id=$1 RETURNING *`, [id]);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getVendor, 
    getVendorById,
    addVendor,
    updateVendor,
    deleteVendor,
};
