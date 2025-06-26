const connection = require("../config/db.connect.js"); //when we use (../) it means back one folder 

//let schema  = 'public';

async function getUser() {
  try {
    const result = await connection.query(`
      SELECT users.*, roles.name AS role_name, branches.name AS branch_name 
      FROM 
          users
      INNER JOIN 
          roles ON users.role_id = roles.id
      INNER JOIN 
          branches ON users.branch_id = branches.id
      ORDER BY users.created_at DESC ; 
  `);
    return result.rows;
  } catch (error) {
    throw error;
  }
};


async function getAllUsers() {
  try{
    const result = await connection.query(`SELECT  * from users where status='active'`);
    return result.rows;
  }
  catch (error) {
    throw error;
  }
};

async function getUserLogin(email, password) {
  // console.log('email: ' + email + ' password: ' + password);
  try {
    const result = await connection.query(`
        SELECT u.*, r.name As role_name FROM users u
        INNER JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1
      `, [email]);
    return user = result.rows[0];
  } catch (error) {
    throw error;
  }
}
async function getUserById(id) {

  try {
    const query = `
      														
	    SELECT users.*, branches.name AS branch_name, roles.name AS role_name
      FROM users 
      INNER JOIN branches ON users.branch_id = branches.id 
      INNER JOIN roles ON users.role_id = roles.id 
      WHERE users.id = $1
    `;
    const result = await connection.query(query, [id]);
    // console.log(result.rows[0]);
    return result.rows;
  } catch (error) {
    throw error;
  }
}


async function addUser(user) {
  // console.log('adding user', user)
  try {
    const { name, contact, email, role_id, user_name, password, status, branch_id } = user;
    const result = await connection.query("INSERT INTO public.users(name, contact, email, role_id, user_name, password, status, branch_id)VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
      [name, contact, email, role_id, user_name, password, status, branch_id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function updateUser(id, user) {
  // console.log("Updating user", user);
  try {
    const { name, contact, email, role_id, user_name, password, status, branch_id } = user;
    const result = await connection.query("UPDATE public.users SET name=$2, contact=$3, email=$4, role_id=$5, user_name=$6, password=$7, status=$8, branch_id=$9 WHERE id=$1 RETURNING *",
      [id, name, contact, email, role_id, user_name, password, status, branch_id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function deleteUser(id) {
  try {
    // console.log(id);
    const result = await connection.query("DELETE FROM public.users WHERE id=$1 RETURNING *", [id]);
    // console.log(result);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getUser,
  getUserById,
  getUserLogin,
  addUser,
  updateUser,
  deleteUser,
  getAllUsers
}
