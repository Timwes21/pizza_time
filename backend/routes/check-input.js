import express from "express";
import { checkIfUsernameExists } from "../db.js";
import { checkStore } from "../dominos.js";


const router = express.Router()


router.post("/username", async (req, res)=>{
    const username = req.body.username;
    const usernameExists = await checkIfUsernameExists(username);
    console.log("check-input.js line 12: " + usernameExists);
    
    if(usernameExists){
        res.status(400).json({message: "Username already exists"});
    }
    else{
        res.status(200).json({message: "Good Username"})
    }
})

router.post("/address", async (req, res)=>{
    const data = req.body;
    const address = data.address;
    const results = await checkStore(address);
    res.json({results: results});
});

export default router;