import { findUser } from "../db.js";
import { decrypt, encrypt  } from "../encryption.js";

const calculateMinutes=(lastOrdered)=>{
    const now = new Date();
    return !lastOrdered ?0: 60-(Math.floor((now - lastOrdered) / (1000 * 60)));
}


export const validateTimer = async (req, res, next) => {
    const token = req.body.token.pizzaTimeToken;
    console.log("timer.js line 12: encrypted token:", token);
    
    const user = await findUser(token);
    // console.log("timer.js line 15: user: ", user);
    
    
    if (user === null){
        res.status(404).json({message: "User not found"});
        return;
    }
    
    const minutesTil = calculateMinutes(user.user.account.lastOrdered);
    // console.log(minutesTil);
    
    
    if (minutesTil > 0){
        res.status(401).json({message: "Woah there fatty! Wait a full hour to order again", timerStatus: minutesTil});
        return;
    }
    user.tipAmount = req.body.tip; 
    req.user = user;
    next();
}
