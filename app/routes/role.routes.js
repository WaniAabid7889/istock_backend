const express = require('express');
const Role = require('../models/role.model.js');

module.exports = function(app) {
    var router = express.Router();
    console.log('role routes', router)
    router.get('/', async function(req, res) {
        const role = await Role.getRole();
        console.log(role)
        
        if (role) {
            res.status(200).json(role);
        } else {
            res.status(400).json({ errors: "No data" });
        }
    });
    router.get('/:id', async function(req, res) {
        const roleId = req.params.id;
        const role = await Role.getRoleById(roleId);
        if (role) {
            res.status(200).json(role[0]);
        } else {
            res.status(400).json({ errors: "No role found" });
            
        }
    });

    router.post('/', async function(req, res) {
        const role = req.body;
        console.warn(role);
        const result = await Role.addRole(role);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ errors: "Error saving role" });
        }
    });

    router.put('/update/:id', async function(req, res) {
        const role = req.body;
        const roleId = req.params.id;
        const result = await Role.updateRole(roleId, role);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ errors: "Error updating role" });
        }
    });

    router.delete('/delete/:id', async function(req, res) {
        const roleId = req.params.id;
        const result = await Role.deleteRole(roleId);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ errors: "Error deleting role" });
        }
    });

    app.use('/role', router);
}