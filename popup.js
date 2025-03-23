

const testApi = "http://localhost:3000/test";
const orderApi = "http://localhost:3000/order/pizza";
    
    
const qs = (e) => document.querySelector(e);
const qsDisplay = (element, setting) => document.querySelector(element).style.display = setting;
const qsValue = (e) => qs(e).value

const checkIfLoggedIn =() =>{chrome.storage.local.get("pizzaTimeToken", (data) => {
    if (!data.pizzaTimeToken){
        qsDisplay(".order", "none");
        qsDisplay(".login", "block");
    }
});}

const orderPizza = async () => {
    
    const tip = qsValue("#tip-amount") === ""?  0:qsValue("#tip-amount");
    fetch(orderApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({tip: tip, token: await chrome.storage.local.get("pizzaTimeToken")})
    }).then(async (response) => {
        const data = await response.json();
        console.log(data.timerStatus);
        
        if (response.status===200){
            console.log('here');
            chrome.storage.local.set({pizzaTimeToken: data.newToken});
            qs("#message").innerText = data.message;
        }
        if (response.status===401){
            console.log(data);
            qsDisplay("#order-display", "none");
            qs("#message").innerText = data.message + "\n Time Left: " + (data.timerStatus) + " minutes";    
        }
    }).catch((err) => {
        console.log(err);
    });
};



const logOut = () =>{
    chrome.storage.local.remove("pizzaTimeToken");
    qsDisplay(".login", "block");
    qsDisplay(".order", "none");
};

const updateUserInfo = ()=> chrome.tabs.create({ url: "/create_account/create_account.html" });
const login = ()=> chrome.tabs.create({ url: "/create_account/create_account.html" });
    
const initEventListeners = () =>{
    qs("#order-button").addEventListener("click", orderPizza);    
    qs("#logout").addEventListener("click", logOut);
    qs("#update-user-button").addEventListener("click", updateUserInfo);
    qs("#login-button").addEventListener("click", login);   
}

initEventListeners();
checkIfLoggedIn();

