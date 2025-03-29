const ws = new WebSocket("ws://backend-server-production-1643.up.railway.app");

const qs = (e) => document.querySelector(e);

ws.onopen = () =>{
    chrome.storage.local.get("pizzaTimeToken", data =>{
        ws.send(data.pizzaTimeToken);
    });
}

ws.onmessage = (event) =>{
    const message = event.data;
    qs("#status").innerText = message;
    
}

