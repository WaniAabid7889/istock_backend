const connection = require("./../config/db.connect.js");

async function getRole(){
    try{
        const result = await connection.query(`SELECT * FROM public.roles`);
        return result.rows;
    }catch(error){
        throw error;
    }
};

async function getRoleById(id){
    try{
        const result = await connection.query(`SELECT * FROM public.roles WHERE id=$1`, [id]);
        return result.rows;
    }catch(error){
        throw error;
    }
};


async function addRole(role){
    try{
        const result = await connection.query(`INSERT INTO public.roles (name,status) VALUES ($1 ,$2) RETURNING *`, [role.name,role.status]);
        return result.rows;
    }catch(error){
        throw error;
    }
};

async function updateRole(id, role){
    try{
    
        console.log("=>",id,role);
        const result = await connection.query(`UPDATE public.roles SET name=$1 WHERE id=$2 RETURNING *`, [role.name, id]);
        return result.rows;
    }catch(error){
        throw error;
    }
};

async function deleteRole(id){
    try{
        const result = await connection.query(`DELETE FROM public.roles WHERE id=$1 RETURNING *`, [id]);
        return result.rows;
    }catch(error){
        throw error;
    }
};

async function getRoleByName(name){
    try{
        const result = await connection.query(`SELECT * FROM public.roles WHERE name=$1`, [name]);
        return result.rows;
    }catch(error){
        throw error;
    }
}

module.exports = {
    getRole,
    getRoleById,
    addRole,
    updateRole,
    deleteRole
}