const connection = require("../config/db.connect.js");


async function getLocation() {
  try {
    const result = await connection.query(
      `SELECT id, name FROM public.location ORDER BY name`
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}


async function getLocationById(id) {
  try {
    const result = await connection.query(
      `SELECT id, name FROM public.location WHERE id = $1`,
      [id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function getLocationByName(name) {
  try {
    const result = await connection.query(
      `SELECT id, name FROM public.location WHERE name = $1`,
      [name]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

async function addLocation({ name }) {
  try {
    const result = await connection.query(
      `INSERT INTO public.location (name)
       VALUES ($1)
       RETURNING id, name`,
      [name]
    );
    return result.rows;
  } catch (error) {
    throw error; // bubble up 23505 for duplicate names
  }
}

// UPDATE
async function updateLocation(id, { name }) {
  try {
    const result = await connection.query(
      `UPDATE public.location
         SET name = $1
       WHERE id = $2
       RETURNING id, name`,
      [name, id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}

// DELETE (hard delete)
async function deleteLocation(id) {
  try {
    const result = await connection.query(
      `DELETE FROM public.location
       WHERE id = $1
       RETURNING id, name`,
      [id]
    );
    return result.rows;
  } catch (error) {
    throw error;
  }
}
 
module.exports = {
  getLocation,
  getLocationById,
  getLocationByName,
  addLocation,
  updateLocation,
  deleteLocation,
};
