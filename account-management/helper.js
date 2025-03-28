export function validateUsername(username){
    const min = 6;
    const max = 20;
    const regex = /^[a-zA-Z0-9_-]+$/;
    
    return (username.length >= min || username.length <= max || regex.test(username));

}

export function validatePassword(password){
    const min = 8
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const digit = /[0-9]/.test(password);
    const specialChars = /[!@#$%^&*]/.test(password);

    return (password.length >= min || upperCase || lowerCase || digit || specialChars)
}

export function validateEmail(email){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validatePhoneNumber(number){
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(number);
}

export function changeForm(form1, form2){
    form1.style.display = "none";
    form2.style.display = "flex";
}

export const qs = (element) => document.querySelector(element);
export const qsValue = (element) => qs(element).value;

export const testCardNumber =(number)=>{
    const cardNumberDashRegex = /^\d{4}([- ]?\d{4}){2,4}$/;
    const cardNumberRegex =  /^\d{13,19}$/;
    const dashResult = cardNumberDashRegex.test(number);
    const result = cardNumberRegex.test(number);
    return dashResult || result;

}

export const validateCard=(number, exp, postal, cvv)=>{
    const expRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; 
    const postalRegex = /^\d{5}$/; 
    const cvvRegex = /^\d{3,4}$/;
    return (testCardNumber(number) && expRegex.test(exp) && postalRegex.test(postal) && cvvRegex.test(cvv));
}
