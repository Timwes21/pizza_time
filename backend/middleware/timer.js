import { findUser } from "../db.js";
import { decrypt, encrypt  } from "../encryption.js";

const calculateMinutes=(lastOrdered)=>{
    const now = new Date();
    return !lastOrdered ?0: 60-(Math.floor((now - lastOrdered) / (1000 * 60)));
}

const validateUser = async(encryptedToken) => {
    const token = decrypt(encryptedToken);
    const user = await findUser(token);
    return user;

}

export const validateTimer = async (req, res, next) => {
    const encryptedToken = req.body.token.pizzaTimeToken;
    console.log("timer.js line 18: encrypted token:", encryptedToken);
    
    const user = await validateUser(encryptedToken);
    console.log("timer.js line 21: user: ", user);
    
    
    if (user === null){
        res.status(404).json({message: "User not found"});
        return;
    }
    
    const minutesTil = calculateMinutes(user.lastOrdered);

    
    if (minutesTil > 0){
        res.status(401).json({message: "Woah there fatty! Wait a full hour to order again", timerStatus: minutesTil});
        return;
    }
    user.tipAmount = req.body.tip; 
    req.user = user;
    next();
}
