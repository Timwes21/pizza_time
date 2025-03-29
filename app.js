// import './sw-omnibox.js';
// import './sw-tips.js';


chrome.storage.local.get("pizzaTimeToken", (data) => {
    if (!data.pizzaTimeToken || data.pizzaTimeToken === null) {
        chrome.tabs.create({ url: "/create_account/create_account.html" });
    }
});







