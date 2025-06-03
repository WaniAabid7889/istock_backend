const express = require('express')
const Issue = require('../models/issue.model.js');

module.exports = function(app) {
    let router = express.Router();
    router.get('/', async function(req, res) {
        const issue = await Issue.getIssue();
        if(issue){
            res.status(200).json(issue);
        }else{
            res.status(400).json({errors : "No data"});
        }
    });

    router.get('/:id',async (req,res)=>{
        try {
            let id = req.params.id;
            const result = await Issue.getIssueById(id);
            if(result){
                res.status(200).json(result);
            }else{
                res.status(404).json({errors : "Issue not found"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({errors : "Internal Server Error"});
        }
    })

    router.post('/', async function(req, res) {
        const issue = await Issue.addIssue(req.body);
        console.log('issue data ',issue);
        if(!issue){
            res.status(400).json({errors : "No data"});
        }
         return res.status(200).json({success : true}); 
    });

    router.put('/updateQuantity/:id', async function(req, res) {
        const issueId = req.params.id;
        console.log('issueId', issueId, req.body);
        const issue = await Issue.updateIssueQuantity(issueId, req.body);
        if(issue){
            res.status(200).json(issue);
        }else{
            res.status(400).json({errors : "No data"});
        }
    })

    router.put('/update/:id', async function(req, res) {
        const issueId = req.params.id;
        const issue = await Issue.updateIssue(issueId, req.body);
        if(issue){
            res.status(200).json(issue);
        }else{
            res.status(400).json({errors : "No data"});
        }
    });

    app.use('/issue', router);
};