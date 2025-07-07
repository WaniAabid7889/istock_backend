/**
 * Table (recommended):
 *   CREATE TABLE assets (
 *     id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 *     location_id   uuid NOT NULL REFERENCES location(id),
 *     asset_type_id uuid NOT NULL REFERENCES asset_type(id),
 *     brand_name    varchar(100),
 *     condition     varchar(100),
 *     quantity      integer NOT NULL CHECK (quantity > 0),
 *     purchase_date date,
 *     remarks       text,
 *     created_at    timestamp NOT NULL DEFAULT current_timestamp,
 *     created_by    uuid REFERENCES users(id),
 *     modified_at   timestamp,
 *     modified_by   uuid REFERENCES users(id)
 *   );
 */

const connection = require("../config/db.connect.js");

async function getAssets() {
  const { rows } = await connection.query(`
    SELECT  a.*,
            l.name          AS location_name,
            t.name          AS asset_type_name
      FROM  public.assets a
      JOIN  public.location     l ON l.id = a.location_id
      JOIN  public.asset_type   t ON t.id = a.asset_type_id
     ORDER  BY a.created_at DESC
  `);
  return rows;
}

async function getAssetById(id) {
  const { rows } = await connection.query(
    `SELECT * FROM public.assets WHERE id = $1`,
    [id]
  );
  return rows;          
}

async function addAsset(asset) {
  const {
    location_id,
    asset_type_id,
    brand_name,
    condition,
    quantity,
    purchase_date,
    remarks,
    created_by,
  } = asset;

  const { rows } = await connection.query(
    `INSERT INTO public.assets
       (location_id, asset_type_id, brand_name, "condition",
        quantity, purchase_date, remarks, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [
      location_id,
      asset_type_id,
      brand_name,
      condition,
      quantity,
      purchase_date,
      remarks,
      created_by,
    ]
  );
  return rows;
}

async function updateAsset(id, asset) {
  const {
    location_id,
    asset_type_id,
    brand_name,
    condition,
    quantity,
    purchase_date,
    remarks,
    modified_by,
  } = asset;

  const { rows } = await connection.query(
    `UPDATE public.assets
        SET location_id   = $1,
            asset_type_id = $2,
            brand_name    = $3,
            "condition"   = $4,
            quantity      = $5,
            purchase_date = $6,
            remarks       = $7,
            modified_by   = $8,
            modified_at   = NOW()
      WHERE id = $9
      RETURNING *`,
    [
      location_id,
      asset_type_id,
      brand_name,
      condition,
      quantity,
      purchase_date,
      remarks,
      modified_by,
      id,
    ]
  );
  return rows;
}

async function deleteAsset(id) {
  const { rows } = await connection.query(
    `DELETE FROM public.assets WHERE id = $1 RETURNING id`,
    [id]
  );
  return rows;
}

module.exports = {
  getAssets,
  getAssetById,
  addAsset,
  updateAsset,
  deleteAsset,
};
