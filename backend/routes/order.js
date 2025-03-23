import express from "express";
import { validateTimer } from "../middleware/timer.js";
import { updateAfterOrder } from "../db.js";
import { encrypt, getToken } from "../encryption.js";
import { order } from "../dominos.js"


const router = express.Router();


router.post("/pizza", validateTimer, async (req, res)=>{
    const user = req.user;
    try {
        //order(user);
        const newToken = getToken();
        const lastOrdered = Date.now();
        const oldToken = user.token
        await updateAfterOrder(oldToken, newToken, lastOrdered);
        console.log('simulated order');
        res.status(200).json({message: "Pizza Ordered!", newToken: encrypt(newToken)});
    }
    catch(error){
        console.log(error);
        
        res.sendStatus(500);
    }
});

export default router;