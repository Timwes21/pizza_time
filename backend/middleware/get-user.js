import { encrypt, decrypt, getToken } from "../encryption.js";
import { findUser } from "../db.js";

const encryptCard = (fields) => {
    const encryptedFields = {};
    for (const [key, value] of Object.entries(fields)){
        encryptedFields[key] = encrypt(value);
    }
    return encryptedFields;
}


export const setUpUser = (req, res, next) => {
    const user = req.body.user;
    const password = user.account.password;
    user.account.password = encrypt(password);
    user.account.token = user.account.token? user.account.token:getToken();
    user.card = encryptCard(user.card);
    req.user = user;
    next();

}

export const decryptUser = async(req, res, next) => {
    const token = req.body.token.pizzaTimeToken;
    
    const user = await findUser(token);
    const userInfo = user.user; 
    
    const { number, expiration, securityCode, postalCode } = userInfo.card;
 
    userInfo.card = {
        number: decrypt(number),        
        expiration: decrypt(expiration),
        postalCode: decrypt(postalCode),
        securityCode: decrypt(securityCode),
    }

    const password = userInfo.account.password;
    userInfo.account.password = decrypt(password);
 
    req.user = userInfo;
    next();
}