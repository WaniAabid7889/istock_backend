const express = require('express')
const Vendor = require('../models/vendor.model.js');

module.exports = function(app) {
    var router = express.Router();
    router.get('/', async function(req, res) {
        const vendor = await Vendor.getVendor();
        if (vendor) {
            res.status(200).send(vendor)
        } else {
            res.status(404).send({
                message: "No vendor found"
            })
        }
    });

    router.get('/:id', async function(req, res) {
        const vendorId = req.params.id;
        const vendor = await Vendor.getVendorById(vendorId);
        console.log(vendor)
        if (vendor) {
            res.status(200).send(vendor)
        } else {
            res.status(404).send({
                message: "No vendor found"
            })
        }
    });

    router.post('/', async function(req, res) {
        const vendor = req.body;
        const result = await Vendor.addVendor(vendor);
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(404).send({
                message: "No vendor found"
            })
        }
    });

    router.put('/update/:id', async function(req, res) {
        const vendor = req.body;
        const vendorId = req.params.id;
        const result = await Vendor.updateVendor(vendorId, vendor);
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(404).send({
                message: "No vendor found"
            })
        }
    });

    router.delete('/:id', async function(req, res) {
        const vendorId = req.params.id;
        const result = await Vendor.deleteVendor(vendorId);
        if (result) {
            res.status(200).send(result)
        } else {
            res.status(404).send({
                message: "No vendor found"
            })
        }
    });

    app.use('/vendor',router);
}
