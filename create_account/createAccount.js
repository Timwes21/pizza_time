const base = "http://localhost:3000";
const testApi = base + "/test";
const createUserApi = base + "/auth/account";
const hasStoreNearbyApi = base + "/check/address";
const loginApi = base + "auth/login";
const checkUsernameApi = base + "/check/username";

const qs = (element) => document.querySelector(element)
const qsValue = (element) => qs(element).value;

const credentialForm = qs("#credentials");
const orderInfoForm = qs("#order-info");
const cardInfoForm = qs("#card-info");
const loginForm = qs("#login-form");


const user = {
    account: {
        username: "",
        password: "",
        token: "",
        lastOrdered: "",
    },
    customer: {
        address: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: ""
    },
    card: {        
        number: "",        
        expiration:"",
        postalCode:"",
        securityCode: "",
    },
    tipAmount: ""
}

const changeForm = (form1, form2) =>{
    form1.style.display = "none";
    form2.style.display = "flex";
}

function validateUsername(username){
    const min = 6;
    const max = 20;
    const regex = /^[a-zA-Z0-9_-]+$/;
    
    if (username.length < min || username.length > max){
        return false;
    }
    if (!regex.test(username)){
        return false;
    }

    return true;

}

function validatePassword(password){
    const min = 8;
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const digit = /[0-9]/.test(password);
    const specialChars = /[!@#$%^&*]/.test(password);

    if (password.length < 8){
        return false;
    }
    if (!upperCase || !lowerCase || !digit || !specialChars){
        return false;
    }

    return true;
}

function validateEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validatePhoneNumber(number){
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(number);
}


function firstNext(){
    let username = qsValue("#username");
    let password = qsValue("#password");
    let email = qsValue("#email");
    let phone = qsValue("#phone-number");
    let firstName = qsValue("#first-name");
    let lastName = qsValue("#last-name");
    
    fetch(checkUsernameApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: username})
    }).then((response) => {
        if (response.status===400){
            qs("#username-exists-message").style.display = "block";
        }
        else if (validateUsername(username) && validatePassword(password) && validateEmail(email) && validatePhoneNumber(phone) && firstName && lastName){
            qs("#error-message").style.display = "none";
            
            user.account = {
                username,
                password,
                token: "",
                lastOrdered: ""
            }
            user.customer = {
                address: "",
                firstName,
                lastName,
                phone,
                email
            }
            changeForm(credentialForm, orderInfoForm);
        }
        else{
            qs(".error-message").style.display = "flex";
        }
    })
    .catch((err)=>{
        console.log("error: ",err);
    });
    

}

function secondNext(){
    let street = qsValue("#street");
    let city = qsValue("#city");
    let zipCode = qsValue("#zipCode");
    let state = qsValue("#state");
    const address = `${street}, ${city}, ${state}, ${zipCode}`;
    fetch(hasStoreNearbyApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({address : address})  
    }).then(response => response.json())
    .then(data => {
        if (data.results === 1){
            user.customer.address = address;
            changeForm(orderInfoForm, cardInfoForm);
        }
        else{
            console.log(data);
            qs("#address-error").innerText = "No store near your address. Check to see if there is a typo.";
        }
    })
    .catch((err) =>{
        console.log(err);
        
    })
    
}

const testCardNumber =(number)=>{
    const cardNumberDashRegex = /^\d{4}([- ]?\d{4}){2,4}$/;
    const cardNumberRegex =  /^\d{13,19}$/;
    const dashResult = cardNumberDashRegex.test(number);
    const result = cardNumberRegex.test(number);
    return dashResult || result;

}

const validateCard=(number, exp, postal, cvv)=>{
    const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; 
    const postalRegex = /^\d{5}$/; 
    const cvvRegex = /^\d{3,4}$/;
    return (testCardNumber(number) && expRegex.test(exp) && postalRegex.test(postal) && cvvRegex.test(cvv));
}

function submit(){
    const number = qsValue("#card-number");
    const expiration = qsValue("#exp");
    const postalCode = qsValue("#postal-code");
    const securityCode = qsValue("#cvv");

    const result = validateCard(number, expiration, postalCode, securityCode)
    if (!result){
        qs("#submit-error-message").innerText = "Improper Card Format";
        return;
    }

    user.card = {
        number, 
        expiration,
        postalCode,
        securityCode
    }
    fetch(createUserApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user: user})
    })
    .then(response => response.json())
    .then(data => {
        chrome.storage.local.set({pizzaTimeToken: data.token});
        chrome.tabs.getCurrent(tab => chrome.tabs.remove(tab.id));
    
    })
    .catch((err) => {
        qs("#submit-error-message").innerText = "Error had occurred, try again later";
        console.log(err);
        
    });
}

function login(){
    const username = qsValue("#login-username");
    const password = qsValue("#login-password");
    
    if (username && password){
        fetch(loginApi, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password})
        }).then(response => response.json())
    .then(data => {
        chrome.storage.local.set({pizzaTimeToken: data.token});
        chrome.tabs.getCurrent(tab => chrome.tabs.remove(tab.id));
        
    })
    .catch((err)=>{
        console.log(err);
        
    })
}
}


const backToFirst = () => changeForm(orderInfoForm, credentialForm);
const backToSecond = ()=> changeForm(cardInfoForm, orderInfoForm);
const loginButton = () => changeForm(credentialForm, loginForm);
const createAccountButton = () => changeForm(loginForm, credentialForm);

const initEventListeners = () => {
    qs("#first-next").addEventListener("click", firstNext);
    qs("#second-next").addEventListener("click", secondNext);
    qs("#submit").addEventListener("click", submit);
    qs("#back-to-first").addEventListener("click", backToFirst);
    qs("#back-to-second").addEventListener("click", backToSecond);
    qs("#login-button").addEventListener("click", loginButton);
    qs("#login-submit").addEventListener("click", login);
    qs("#create-an-account").addEventListener("click", createAccountButton);
}

initEventListeners();