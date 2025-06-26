const express = require('express');
const Branch = require("../models/branch.model.js");
module.exports = function(app){

    var router = require("express").Router(); 
    router.get('/', async function(req, res) {
        try {
            const result = await Branch.getBranch();
            // console.log(user);
            if(result){
                res.status(200).json(result);
            }else{
                res.status(404).json({errors : "No data found"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({errors : "Internal Server Error"});
        }
    });

    router.get('/:id', async function(req, res) {
        try {
            const branchId = req.params.id;
            const branch =  await Branch.getBranchById(branchId);
            if(branch){
                res.status(200).json(branch[0]);
            }else{
                res.status(404).json({errors : "No branch found"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({errors : "Internal Server Error"});
        }
    });

    router.post('/', async function(req, res) {
        try {
            const branch = req.body;
            const result = await Branch.addBranch(branch);
            if(result){
                res.status(201).json({success : true ,message :" Branch Added Successfully ",result});
            }else{
                res.status(400).json({errors : "Error saving branch"});
            }
        } catch (error) {
            console.error('Error adding branch:', error);
            res.status(error.status || 500).json({ errors: error.message || "Internal Server Error" });
        }
    }); 

    router.put('/update/:id', async function(req, res) {
        try {
            const branch = req.body;
            const branchId = req.params.id;
            const result = await Branch.updateBranch(branchId, branch);
            // console.log(result);
            if(result){
                res.status(200).json({success: true ,message : "Updating branch successfully",result});
            }else{
                res.status(400).json({errors : "Error updating branch"});
            }
        } catch (error) {
            console.error('Error updating branch:', error);
            res.status(error.status || 500).json({ errors: error.message || "Internal Server Error" });
        }
    });

    router.delete("/delete/:id", async (req, res) => {
    const branchId = req.params.id;
        try {
            const result = await Branch.deleteBranch(branchId);

            if (result.length > 0) { 
            res.status(200).json({ message: "Branch deleted successfully" });
            } else {
            res.status(400).json({ message: "Error deleting branch" });
            }
        } catch (error) {
            console.error("Error deleting branch:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    });
    
    app.use("/branch", router);
};

