import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();


const db_name = "test"
const client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export async function insertUser(user) {
    const db = client.db(db_name);
    const collection = db.collection("users");
    const result = await collection.insertOne(user);
    console.log(`${result.insertedCount} user added`);
}

export async function findUser(token){
    const db = client.db(db_name);
    const users = db.collection("users");
    const user = await users.findOne({token: token})
    console.log(user);
    return user
}

export async function updateAfterOrder(oldToken, newToken, lastOrdered){
    const db = client.db(db_name);
    const users = db.collection("users");

    const result = await users.updateOne(
        { token: oldToken }, 
        { $set: { lastOrdered: lastOrdered, token: newToken} } 
    );
    return result.acknowledged;
}

export async function Authenticate(username, password){
    const db = client.db(db_name);
    const users = db.collection("users");
    const user = await users.findOne({username: username, password: password});
    return user? user.token: null;
}

export async function checkIfUsernameExists(username){
    const db = client.db(db_name);
    const users = db.collection("users");
    const existedingUsers = await users.find({ username: username }).toArray();
    console.log(existedingUsers);
    return existedingUsers.length > 0? true: false;
}




