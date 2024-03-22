const express = require('express');
const bodyParser = require('body-parser'); // Import body-parser middleware
const app = express();


import('node-fetch')
    .then(({ default: fetch }) => {
// Prices
const counterPrice = {
    Chapati: 20,
    Ugali: 40,
    Mukimo: 70,
    Rice: 50,
    Pilau: 80,
    Ndengu: 50,
    Beans: 60,
    Fish: 200,
    Chuma: 10,
};

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Global variable to store phone number
let globalPhoneNumber;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile('chafua.html', { root: __dirname });
});

// Middleware to intercept and store phone number
app.use('/sendSearchName', (req, res, next) => {
    globalPhoneNumber = req.body.value.toString();
    next();
});

// Handle sending search name
app.get('/sendSearchName', (req, res) => {
    res.send('Button click received by server');
});

// Handle sending chapati value from webpage
app.post('/sendChapatiValue', (req, res) => {
    const chapoValue = parseFloat(req.body.value);
    console.log('Chapati value received from webpage:', chapoValue);
    const amount = chapoValue * counterPrice.Chapati;
    console.log('Amount:', amount);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 0OCkkkjFSH2RBMUPMMAzc2zGOmrh'
    };

    fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "BusinessShortCode": 174379,
            "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwMjA2MjMxMjAy",
            "Timestamp": "20240206231202",
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": globalPhoneNumber,
            "PartyB": 174379,
            "PhoneNumber": globalPhoneNumber,
            "CallBackURL": "https://mydomain.com/path",
            "AccountReference": "CompanyXLTD",
            "TransactionDesc": "Payment of X"
        })
    })
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log(error));

    res.send('Value received by server');
});
    });

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
