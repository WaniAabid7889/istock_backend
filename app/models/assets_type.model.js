const connection = require("../config/db.connect.js");

async function getAssetTypes() {
  const res = await connection.query(
    `SELECT id, name, asset_code, is_movable, description, created_at
       FROM public.asset_type
       ORDER BY name`
  );
  return res.rows;
}

async function getAssetTypeById(id) {
  const res = await connection.query(
    `SELECT id, name, asset_code, is_movable, description, created_at
       FROM public.asset_type
       WHERE id = $1`,
    [id]
  );
  return res.rows;
}

async function addAssetType(at) {
  const res = await connection.query(
    `INSERT INTO public.asset_type
       (name, asset_code, is_movable, description)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, asset_code, is_movable, description, created_at`,
    [at.name, at.asset_code, at.is_movable, at.description]
  );
  return res.rows;
}

async function updateAssetType(id, at) {
  const res = await connection.query(
    `UPDATE public.asset_type
       SET name = $1, asset_code = $2, is_movable = $3, description = $4
     WHERE id = $5
     RETURNING id, name, asset_code, is_movable, description, created_at`,
    [at.name, at.asset_code, at.is_movable, at.description, id]
  );
  return res.rows;
}

async function deleteAssetType(id) {
  const res = await connection.query(
    `DELETE FROM public.asset_type
       WHERE id = $1
     RETURNING id, name`,
    [id]
  );
  return res.rows;
}

module.exports = {
  getAssetTypes,
  getAssetTypeById,
  addAssetType,
  updateAssetType,
  deleteAssetType,
};
