const paymentStatus = "APPROVED";
//CHECK THE payment status and print the appropriate message
if (paymentStatus === "APPROVED") {
    console.log("Pet-care services confirmed. Thank you for your payment.");
}
    else if (paymentStatus === "PENDING") {
    console.log("Your payment is pending. We will notify you once it's processed.");
}
    else {
    console.log("An error occurred while processing your payment. Please contact support.");
}

