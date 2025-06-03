const express = require('express');
const Auth = require("../models/auth.model.js");
const {fetchUser, fetchApi} = require('../middleware/fetchApi.js');
const Permission = require("../models/permission.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");    
module.exports = function (app) {
    var router = require("express").Router();
    router.get('/', fetchApi, async function (req, res) {
        const user = await Auth.getUser();  
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ errors: "No data" });
        }
    });


    router.get('/:email/:password', async function (req, res) {
        const email = req.params.email;
        const password = req.params.password;
        console.log(email, password);

        const user = await Auth.getUserLogin(email);    
        console.log('user=>', user);
        if (!user) {
            return res.status(400).json({ errors: "No user found", success: false });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ errors: "Invalid password", success: false });
        }

        console.log('Role ID: ' + user.role_id);
        const permission = await Permission.getPermissionByRoleId(user.role_id);
        console.log('Permission: ', permission);
        
        const token = jwt.sign({user,permission}, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });
        console.log('token value :', token);
    
        //res.status(200).json({ token });
        
        res.status(200).json({token, success: true });
        
    });

    router.get('/getAllUsers', async function (req, res) {
        const  user = await Auth.getAllUsers();
        if (user) {
            res.status(200).json( user );
        }else{
            res.status(404).json({errors:"no user found"});
        }
    });

    router.get('/:id', async function (req, res) {
        const userId = req.params.id;
        const user = await Auth.getUserById(userId);
        console.log(user);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(400).json({ errors: "No user found" });
        }
    });

    router.get('/:email/:password', async function (req, res) {
        const email = req.params.email;
        const password = req.params.password;
        const user = await Auth.getUserLogin(email, password);
        console.log('user', user);
        if (user) {
            res.status(200).json({ user, success: true });
        } else {
            res.status(400).json({ errors: "No user found", success: false });
        }
    })

    router.post('/', async function (req, res) {
        const user = req.body;
        console.log(user);
        try {

            const { username, password } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            user.password = hash;
            const result = await Auth.addUser(user);
            console.log('result value',result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(400).json({ errors: "Error saving user"});
            }

        } catch (err) {
            console.log(err);
            res.status(400).json({ errors: "Error saving user",success:false });
        }

    });

    router.put('/update/:id', async function (req, res) {
        const user = req.body;
        const userId = req.params.id;
        const result = await Auth.updateUser(userId, user);
        console.log(result);
        if (result) {
            res.status(200).json({result,success:true});
        } else {
            res.status(400).json({ errors: "Error updating user",success:false });
        }
    });

    router.delete('/delete/:id', async function (req, res) {
        const userId = req.params.id;
        console.log('Deleting user with id:', userId);
        const result = await Auth.deleteUser(userId)
        if (result) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(400).json({ errors: "Error deleting user" });
        }
    });

    app.use("/auth", router);
};
