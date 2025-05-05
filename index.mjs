const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({ success: true, message: 'Welcome to the NodeCart API!' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
