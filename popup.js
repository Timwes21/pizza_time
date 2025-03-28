

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

const popupTracker = () => {
    chrome.windows.create({
        url: "/tracker/tracking.html",
        type: "popup",
        width: 200,
        height: 100,
    })
}

const displayStatus = async(response) =>{
    const data = await response.json();
    // console.log(data);
    let displayMessage = data.message;
    qsDisplay("#order-display", "none");
    popupTracker();
    
    if (response.status===200){
        chrome.storage.local.set({pizzaTimeToken: data.newToken});

    }
    else if(response.status===401){
        displayMessage += "\n Time Left: " + (data.timerStatus) + " minutes";    
    }
    qs("#message").innerText = displayMessage;
}


const orderPizza = async () => {
    const tip = qsValue("#tip-amount") === ""?  0:qsValue("#tip-amount");
    fetch(orderApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({tip: tip, token: await chrome.storage.local.get("pizzaTimeToken")})
    }).then(async (response) => {
        displayStatus(response);
    }).catch((err) => {
        console.log(err);
        qs("#message").innerText = err;
        qsDisplay("#order-display", "none");
    });
};



const logOut = () =>{
    chrome.storage.local.remove("pizzaTimeToken");
    qsDisplay(".login", "block");
    qsDisplay(".order", "none");
};

const updateUserInfo = ()=> chrome.tabs.create({ url: "account-management/update_account/update_account.html" });
const login = () => chrome.tabs.create({ url: "account-management/create_account/create_account.html" });
    
const initEventListeners = () =>{
    qs("#order-button").addEventListener("click", orderPizza);    
    qs("#logout").addEventListener("click", logOut);
    qs("#update-user-button").addEventListener("click", updateUserInfo);
    qs("#login-button").addEventListener("click", login);   
}

initEventListeners();
checkIfLoggedIn();

