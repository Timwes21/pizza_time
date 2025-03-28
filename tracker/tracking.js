const ws = new WebSocket("ws://localhost:3000");

const qs = (e) => document.querySelector(e);

ws.onopen = () =>{
    chrome.storage.local.get("pizzaTimeToken", data =>{
        console.log(data.pizzaTimeToken);
        ws.send(data.pizzaTimeToken);
    });
}

ws.onmessage = (event) =>{
    const message = event.data;
    console.log(message);
    qs("#status").innerText = message;
    
}

