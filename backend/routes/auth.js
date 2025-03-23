import express from "express";
import { encrypt } from "../encryption.js";
import { Authenticate, insertUser } from "../db.js";
import { setUpUser } from "../middleware/get-user.js";

const router = express.Router()



router.post("/account", setUpUser, (req, res) => {
    const user = req.user;
    insertUser(user);
    res.status(201).json({token: encrypt(user.account.token)});
});


router.post("/login", async (req, res)=>{
    const { username, password } = req.body;
    const encryptedPassword = encrypt(password);
    const token = await Authenticate(username, encryptedPassword);
    if (token != null){
        const encryptedToken = encrypt(token);
        res.status(200).json({token: encryptedToken});
    }
    else{
        res.status(400).json({loggedIn: false});
    }
    
})

export default router;