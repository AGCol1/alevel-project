
const express = require('express');
const fetch = require('node-fetch'); 
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/getTeams', async (req, res) => {
    try {
        const response = await fetch('http://192.168.1.185/getTeams.php');
        const data = await response.text();  
        res.send(data);                    
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.listen(3000, () => console.log('Proxy running at http://localhost:3000'));
