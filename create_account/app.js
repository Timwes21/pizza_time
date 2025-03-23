// import './sw-omnibox.js';
// import './sw-tips.js';


chrome.storage.local.get("pizzaTimeToken", (data) => {
    if (!data.pizzaTimeToken || data.pizzaTimeToken === null) {
        console.log("User is not logged in. Opening login page...");
        chrome.tabs.create({ url: "/create_account/create_account.html" });
    }
});







