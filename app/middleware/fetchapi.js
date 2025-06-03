const jwt = require('jsonwebtoken');
const Auth = require("../models/auth.model.js");

const fetchApi = async (req, res, next) => {
   const token = req.headers.authorization?.split(' ')[1];
    console.log('token==>', token);
   
    if (!token) {
        return res.status(401).send({ errors: "Please authenticate" })
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET,{expiresIn:'5h'}).user;
        
        if (user) {
            const userRec = await Auth.getUserLogin(user.email, user.password);
            if (!userRec) {
                return res.status(400).json({ errors: "Invalid User" });
            }
            // req["userinfo"] = user;
            // console.log(req);
            next();
        } else {
            return res.status(400).json({ errors: "Invalid User" });
        }

    } catch (error) {
        console.log(error);
        return res.status(401).send({ errors: "Please authenticate" })
    }
} 
module.exports = { fetchApi }
