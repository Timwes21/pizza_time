import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const algorithm = process.env.ALGORITHM;

 // Convert KEY to a Buffer
const iv = Buffer.from(process.env.IV, 'hex');  // Convert IV to a Buffer


export function encrypt(text){
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(process.env.KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(text){
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(process.env.KEY, 'hex'), iv);
    let decrypted = decipher.update(text, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

export const getToken = () => crypto.randomBytes(64).toString('hex');

