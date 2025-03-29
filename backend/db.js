import { MongoClient } from "mongodb";
import { encrypt, decrypt } from "./encryption.js";


const db_name = "test"
const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const initToken =(receivedToken) => receivedToken.length > 128?decrypt(receivedToken): receivedToken;

export async function insertUser(user) {
    const db = client.db(db_name);
    const collection = db.collection("users");
    const result = await collection.insertOne(user);
}

export async function findUser(receivedToken){
    const token = initToken(receivedToken);
    const db = client.db(db_name);
    const users = db.collection("users");
    const user = await users.findOne({"user.account.token": token });
    return user;
}

export async function updateAfterOrder(oldToken, newToken, lastOrdered){
    const db = client.db(db_name);
    const users = db.collection("users");
    
    

    const result = await users.updateOne(
        { "user.account.token": oldToken }, 
        { $set: { "user.account.lastOrdered": lastOrdered, "user.account.token": newToken} } 
    );
    return result.acknowledged;
}

export async function Authenticate(username, password){
    const db = client.db(db_name);
    const users = db.collection("users");
    const user = await users.findOne({"user.account.username": username, "user.account.password": encrypt(password)});
    return user? user.token: null;
}

export async function checkIfUsernameExists(username){
    const db = client.db(db_name);
    const users = db.collection("users");
    const existingUsers = await users.find({ "user.account.username": username }).toArray();
    return existingUsers.length > 0
}

export async function updateUser(userToUpdate){
    const db = client.db(db_name);
    const users = db.collection("users");
    
    const result = await users.updateOne(
        { "user.account.token": userToUpdate.account.token }, 
        { $set: { user: userToUpdate } } 
    );
    return result.acknowledged;
}




