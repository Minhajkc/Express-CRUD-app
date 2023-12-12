const express = require('express');
const app = express();
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const myUuid = uuidv4();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const JSON_FILE_PATH = 'file.json';
let jsonData = [];


try {
    if (fs.existsSync(JSON_FILE_PATH)) {
        const rawData = fs.readFileSync(JSON_FILE_PATH);
        jsonData = JSON.parse(rawData);
    }
} catch (err) {
    console.error('Error reading JSON file:', err.message);
}



app.get('/', (req, res) => {
    res.render('index', { jsonData });
});



app.get('/homemy', (req, res) => {
    res.render('index', { jsonData });
});



app.post('/submit', (req, res) => {
    try {
        const formData = req.body;
        formData.id = myUuid;

        jsonData.push(formData);

        fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(jsonData, null, 2));
        res.redirect('/form')
    } catch (err) {
        res.status(500).send(err.message);
    }
});



app.get('/delete/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const userIndex = jsonData.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            jsonData.splice(userIndex, 1);

            fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(jsonData, null, 2));

           res.redirect('/')
        } else {
            res.status(404).json('User not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});



app.get('/form', (req, res) => {
    res.render('form');
});




app.get('/edit/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const user = jsonData.find(user => user.id === userId);

        if (user) {
            res.render('update', { user });
        } else {
            res.status(404).json('User not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});



app.post('/update/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const userIndex = jsonData.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
           
            jsonData[userIndex] = { id: userId, ...req.body };

            fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(jsonData, null, 2));

            res.redirect('/'); 
        } else {
            res.status(404).json('User not found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


const PORT = 6040;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
