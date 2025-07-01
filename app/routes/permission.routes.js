const express = require('express');
const Permission = require('../models/permission.model.js');

module.exports = function (app) {
    var router = express.Router();


    router.get('/', async function (req, res) {
         const permission = await Permission.getPermission();
        //  console.log('permission=>   : ',permission)
        if (permission) {
            res.status(200).json(permission);
        } else {
            res.status(400).json({
                errors: "No permission found"
            });
        }
    });

    router.get('/:id', async function (req, res) {
        const permissionId = req.params.id;
        const permission = await Permission.getPermissionById(permissionId);
        // console.log(permission)
        if (permission) {
            res.status(200).json(permission );
        } else {
            res.status(400).json({
                errors: "No permission found"
            });
        }
    });

    router.post('/create', async function (req, res) {
        const permission = req.body;
        const result = await Permission.addPermission(permission);
        if (result) {
            res.status(200).json( { success:true } );
        } else {
            res.status(400).json({
                errors: "Error saving permission"
            });
        }
    });


    router.put('/update/:id', async function (req, res) {
        const permission = req.body;
        const permissionId = req.params.id;
        const result = await Permission.updatePermission(permissionId, permission);
        // console.log(result)
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(400).json({
                errors: "Error updating permission"
            });
        }
    });
    router.delete('/delete/:id', async function (req, res) {
        const permissionId = req.params.id;
        const result = await Permission.deletePermission(permissionId);
        // console.log('result value =>',result)
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(400).json({
                errors: "Error deleting permission"
            });
        }
    });

    router.get('/role/:name',async function (req, res) {
        const roleName = req.params.name;
        const permission = await Permission.getPermissionByRole(roleName);
        // console.log('permission=>   : ',permission)
       if (permission) {
            res.status(200).json(permission);
        } else {
            res.status(400).json({
                errors: "No permission found"
            });
        }
    })

    router.get('/roleId/:roleId/moduleId/:moduleId', async function (req, res) {
        const roleId = req.params.roleId;
        const moduleId = req.params.moduleId;
      
        // console.log('roleId:', roleId);
        // console.log('moduleId:', moduleId);
      
        try {
         
          const permission = await Permission.getPermissionByRoleIdAndModuleId(roleId, moduleId);
            // console.log('permission=>   : ',permission) 
          if (permission) {
            res.status(200).json(permission);
          } else {
            res.status(404).json({ errors: "No permission found for this role and module combination" });
          }
        } catch (error) {
        //   console.error(error);
          res.status(500).json({ errors: "Internal server error" }); 
        }
      });
    
      router.get('/roles/:id', async function(req, res) {
        const roleId = req.params.id;
        // console.log('roleId:', roleId);
        const permission = await Permission.getPermissionByRoleId(roleId);
        //  console.log('permission=>  : ',permission)
        if (permission) {
            res.status(200).json(permission);
        } else {
            res.status(400).json({
                errors: "No permission found"
            });
        }
      })

    app.use('/permission', router);
}   