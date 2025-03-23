
const user = {
    card: {
        number: "",
        expiration: "",
        firstName: "",
        lastName: "",
        postalCode: "",
        securityCode: "",
    }
}
const number = 1;
const expiration = 2;
const firstName = 3;
const lastName = 4;
const postalCode = 5;
const cvv = 6;
user.card = {
    number,
    expiration,
    firstName,
    lastName,
    postalCode,
    securityCode: cvv,
};

console.log(user);

