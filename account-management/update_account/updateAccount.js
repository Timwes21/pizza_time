import { qs, qsValue, validateEmail, validatePassword, validatePhoneNumber, validateUsername, changeForm, validateCard } from "../helper.js";
const base = "https://backend-server-production-1643.up.railway.app"

const userInfoApi = base + "/auth/user-info";
const updateUserApi = base + "/auth/update";
const hasStoreNearbyApi = base + "/check/address";
const checkUsernameApi = base + "/check/username";


const credentialForm = qs("#credentials");
const orderInfoForm = qs("#order-info");
const cardInfoForm = qs("#card-info");

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

const loadUserInfo = async() =>{
    fetch(userInfoApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token: await chrome.storage.local.get("pizzaTimeToken")})
    })
    .then(response => response.json())
    .then((data)=>{
        const userToChange = data;
        const userAccount = userToChange.account;
        const userCustomer = userToChange.customer;
        const userCard = userToChange.card;

        const { username, password, token, lastOrdered } = userAccount;
        
        
        localStorage.setItem("username", username);
        qs("#username").value = username;
        qs("#password").value = password;
        user.account.token = token;
        user.account.lastOrdered = lastOrdered
        
        const { address, firstName, lastName, phone, email } = userCustomer;
        
        qs("#email").value = email; 
        qs("#phone-number").value = phone;
        qs("#first-name").value = firstName;
        qs("#last-name").value = lastName;
        
        const [ street, city, state, zip ] = address.split(",").map(part => part.trim())
        
        qs("#street").value = street;
        qs("#city").value = city;
        qs("#state").value = state;
        qs("#zip").value = zip;
        
        const { number, expiration, postalCode, securityCode } = userCard;

        qs("#card-number").value = number;
        qs("#exp").value = expiration;
        qs("#cvv").value = securityCode;
        qs("#postal-code").value = postalCode;

        console.log("postal code: ", postalCode);
        


    })
    .catch((err)=>{
        console.log(err);
        
    })
}


function firstNext(){
    let username = qsValue("#username");
    let password = qsValue("#password");
    let email = qsValue("#email");
    let phone = qsValue("#phone-number");
    let firstName = qsValue("#first-name");
    let lastName = qsValue("#last-name");
    
    const moveForward = ()=>{
        if (validateUsername(username) && validatePassword(password) && validateEmail(email) && validatePhoneNumber(phone) && firstName && lastName){
            qs("#error-message").style.display = "none";
            
            user.account.username = username;
            user.account.password = password;
            user.customer.firstName = firstName;
            user.customer.lastName = lastName;
            user.customer.phone = phone;
            user.customer.email = email;
            changeForm(credentialForm, orderInfoForm);
        }
        else{
            qs(".error-message").style.display = "flex";
        }
    }



    if (username !== localStorage.getItem("username")){
        fetch(checkUsernameApi, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username})
        }).then((response) => {
            if (response.status===400){
                qs("#username-exists-message").style.display = "block";
                return;
            }
            moveForward();
        })
        .catch((err)=>{
            console.log("error: ",err);
        });
    }
    else{
        moveForward();
    }
}

function secondNext(){
    let street = qsValue("#street")
    let city = qsValue("#city")
    let zipCode = qsValue("#zip")
    let state = qsValue("#state")
    const address = `${street}, ${city}, ${state}, ${zipCode}`
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
            qs("#address-error").innerText = "No store near your address. Check to see if there is a typo."
        }
    })
    .catch((err) =>{
        console.log(err);
        
    })
    
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
    fetch(updateUserApi, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user: user})
    })
    .then(response => {
        localStorage.removeItem("username");
        chrome.tabs.getCurrent(tab => chrome.tabs.remove(tab.id));
    })
    .catch((err) => {
        qs("#submit-error-message").innerText = "Error had occurred, try again later";
        console.log(err);
        
    });
}


const backToFirst = () => changeForm(orderInfoForm, credentialForm);
const backToSecond = ()=> changeForm(cardInfoForm, orderInfoForm);

const initEventListeners = () =>{
    qs("#first-next").addEventListener("click", firstNext);
    qs("#second-next").addEventListener("click", secondNext);
    qs("#submit").addEventListener("click", submit);
    qs("#back-to-first").addEventListener("click", backToFirst);
    qs("#back-to-second").addEventListener("click", backToSecond);
}

loadUserInfo();
initEventListeners();