const payments = [
    {petname: "Chester", amount: 50, status: "APPROVED"},
    {petname: "Mochi", amount: 80, status: "PENDING"},
    {petname: "Mira", amount: 40, status: "DECLINED"},
    
];

for (let i = 0; i < payments.length; i++) {
    if (payments[i].status === "APPROVED") {
        console.log(`Pet-care services confirmed for ${payments[i].petname}. Thank you for your payment.`);
    } else if (payments[i].status === "PENDING") {
        console.log(`Payment for ${payments[i].petname} is pending. We will notify you once it's processed.`);
    } else {
        console.log(`Payment for ${payments[i].petname} was declined.`);
    }
}

payments.forEach(payment => {
    if (payment.status === "APPROVED") {
        console.log(`Pet-care services confirmed for ${payment.petname}. Thank you for your payment.`);
    } else if (payment.status === "PENDING") {
        console.log(`Payment for ${payment.petname} is pending. We will notify you once it's processed.`);
    } else {
        console.log(`Payment for ${payment.petname} was declined.`);
    }
});

// using for each for a scenario of when we never know 
//how many values inside the list or dictionary 