import express from "express";
import { encrypt } from "../encryption.js";
import { Authenticate, insertUser, updateUser, findUser } from "../db.js";
import { setUpUser, decryptUser } from "../middleware/get-user.js";

const router = express.Router()



router.post("/account", setUpUser, (req, res) => {
    const userInfo = req.user;
    const user = { user: userInfo}
    insertUser(user);
    res.status(201).json({token: encrypt(userInfo.account.token)});
});


router.post("/login", async (req, res)=>{
    const { username, password } = req.body;
    const token = await Authenticate(username, password);
    if (token){
        const encryptedToken = encrypt(token);
        res.status(200).json({token: encryptedToken});
    }
    else{
        res.status(400).json({loggedIn: false});
    }
    
})

router.post("/user-info", decryptUser, async(req, res)=>{
    const user = req.user;
    res.status(200).json(user);
})

router.post("/update", setUpUser, async(req, res)=>{
    try{
        const updatedUser = req.user;
        await updateUser(updatedUser);
        res.sendStatus(200);
    }
    catch(err){
        console.log("auth.js line 45: error: ", err);
        res.status(500).send(err);
        
    }

})

export default router;