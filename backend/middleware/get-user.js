import { encrypt, getToken } from "../encryption.js";

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
    const token = getToken();
    user.account.token = token;
    user.card = encryptCard(user.card);
    req.user = user;
    next()

}