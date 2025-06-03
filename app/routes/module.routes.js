const express = require('express');
const Module = require('../models/module.model.js');

module.exports = function (app) {
    var router = express.Router();

    router.get('/', async function (req, res) {
        const module = await Module.getModule();
        if(module){
            res.status(200).send(module);
        }else{
            res.status(404).send({
                message: 'No module found'
            });
        }
    });

    router.get('/:id', async function (req, res){
        const moduleId = req.params.id;
        const module = await Module.getModuleById(moduleId);
        if(module){
            res.status(200).send(module);
        }else{
            res.status(404).send({
                message: 'No module found'
            });
        }
    });

    router.post('/', async function (req, res){
        const module = req.body;
        const result = await Module.addModule(module);
        if(result){
            res.status(200).send({success:true});
        }else{
            res.status(404).send({
                message: 'No module found'
            });
        }
    });

    router.put('/update/:id', async function (req, res){
        const module = req.body;
        const moduleId = req.params.id;
        console.log('module =>',module)
        const result = await Module.updateModule(moduleId, module);
        if(result){
            res.status(200).send(result);
        }else{
            res.status(404).send({
                message: 'No module found'
            });
        }
    });

    router.delete('/:id', async function (req, res){
        const moduleId = req.params.id;
        const result = await Module.deleteModule(moduleId);
        if(result){
            res.status(200).send(result);
        }else{
            res.status(404).send({
                message: 'No module found'
            });
        }
    });

    app.use('/module', router);
}