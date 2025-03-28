import express from "express";
import cors from "cors";
import checkInputRoute from "./routes/check-input.js";
import authRoute from "./routes/auth.js";
import orderRoute from "./routes/order.js";
import { WebSocketServer } from "ws";
import { findUser } from "./db.js";
import http from "http";
import { track } from "./dominos.js"

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });


app.use(express.json());

app.use(cors({
    origin: ["http://127.0.0.1:5500", "chrome-extension://kbfmgmlcmfikaahhjgkkdjlnfeilmghi", "extension://kbfmgmlcmfikaahhjgkkdjlnfeilmghi"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));



wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', async(bufferedToken) => {
        try{
            const token = bufferedToken.toString()
            console.log(token);
            const user = await findUser(token);
            const number = user.user.customer.phone;
            const results = await track(number);
            ws.send(`Echo: ${results}`); 
        }
        catch(error){
            console.log(error);
            ws.send(`Echo: ${error}`); 
            
        }
    });

    ws.on('close', () => console.log('Client disconnected'));
});



app.use("/check", checkInputRoute);
app.use("/auth", authRoute);
app.use("/order", orderRoute);

const PORT = 3000;
server.listen(PORT, () => {
    console.log("running on port", PORT);    
});