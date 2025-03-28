import express from "express";
import { validateTimer } from "../middleware/timer.js";
import { updateAfterOrder, findUser } from "../db.js";
import { getToken, encrypt } from "../encryption.js";
import { order, track } from "../dominos.js";


const router = express.Router();


const changeToken = async(newToken, user)=>{
    const lastOrdered = Date.now();
    const oldToken = user.account.token;
    // console.log("order.js line 14: ", oldToken);
    await updateAfterOrder(oldToken, newToken, lastOrdered);
    // console.log("here");
    
    return encrypt(newToken);
}


router.post("/pizza", validateTimer, async (req, res)=>{
    const user = req.user.user;
    try {
        const wait = await order(user);
        const newToken = await changeToken(getToken(), user);
        res.status(200).json({message: wait.message, newToken: newToken});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
});

router.post("/tracker", async(req, res)=>{
    const token = req.body.token.pizzaTimeToken;
    
    const user = await findUser(token);
    const number = user.user.customer.phone
    console.log("number: ", number);
    
    try{
        const results = await track(number);
        res.status(200).json(results);
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
        
    }
})


export default router;