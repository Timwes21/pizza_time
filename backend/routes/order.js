import express from "express";
import { validateTimer } from "../middleware/timer.js";
import { updateAfterOrder } from "../db.js";
import { encrypt, getToken } from "../encryption.js";
import { order, track } from "../dominos.js"


const router = express.Router();


router.post("/pizza", validateTimer, async (req, res)=>{
    const user = req.user;
    try {
        const wait = await order(user);
        
        // const estimatedWait = await track(user.customer.phone);
        if (wait.status){
            const newToken = getToken();
            const lastOrdered = Date.now();
            const oldToken = user.token;
            console.log("order.js line 21:" + wait);
            await updateAfterOrder(oldToken, newToken, lastOrdered);
            res.status(200).json({message: wait.message, newToken: encrypt(newToken)});
        }
        else{
            res.status(500).json({message: wait.message});
        }
    }
    catch(error){
        console.log("order.js line 30:" + error);
        
        res.status(500).json({message: error});
    }
});



export default router;