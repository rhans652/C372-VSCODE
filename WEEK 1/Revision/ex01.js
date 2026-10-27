const groomingFee = 50;
const numberOfPets = 2;
const gstRate = 0.09;


const subtotal = groomingFee * numberOfPets;
const gstAmount = subtotal * gstRate;
const totalAmount = subtotal + gstAmount;


const message = " the total cost is $"+totalAmount;
const msg = `The total cost is $${totalAmount.toFixed(2)}`;
console.log(msg);