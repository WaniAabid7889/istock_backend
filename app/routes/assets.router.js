const express = require("express");
const Assets  = require("../models/assets.model.js");

module.exports = function (app) {
  const router = express.Router();

  router.get("/", async (_req, res) => {
    try {
      const data = await Assets.getAssets();
      if (!data.length) return res.status(404).json({ errors: "No data" });
      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: "Server error" });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const rows = await Assets.getAssetById(req.params.id);
      if (!rows.length) return res.status(404).json({ errors: "Not found" });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: "Server error" });
    }
  });

 
  router.post("/add", async (req, res) => {
    try {
      const rows = await Assets.addAsset(req.body);
      res.status(201).json(rows[0]);
    } catch (err) {
      if (err.code === "23503") {
        return res.status(400).json({ errors: "Invalid foreign key" });
      }
      console.error(err);
      res.status(500).json({ errors: "Server error" });
    }
  });

  router.put("/update/:id", async (req, res) => {
    try {
      const rows = await Assets.updateAsset(req.params.id, req.body);
      if (!rows.length) return res.status(404).json({ errors: "Not updated" });
      res.status(200).json(rows[0]);
    } catch (err) {
      if (err.code === "23503") {
        return res.status(400).json({ errors: "Invalid foreign key" });
      }
      console.error(err);
      res.status(500).json({ errors: "Server error" });
    }
  });

  router.delete("/delete/:id", async (req, res) => {
    try {
      const rows = await Assets.deleteAsset(req.params.id);
      if (!rows.length) return res.status(404).json({ errors: "Not deleted" });
      res.status(200).json(rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ errors: "Server error" });
    }
  });
  app.use("/assets", router);
};
