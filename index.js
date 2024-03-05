const express = require('express');
const mysql2 = require('mysql2');
const port = 3000;
const app = express()
app.use(express.json())
app.listen(port, () => {
    console.log(`Server listening at port ${port}.`)
});

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

connection.connect((err) => {
    if(err) {
        console.log('Error connecting to MySQL', err);
    }
    else {
        console.log('Connected to MySQL database');
    }
});

app.post('/users', (req, res) => {

    const newUser = req.body;

    connection.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if(err) {
            res.json({ message: 'Server error', errorCode: 0 });
        }
        else {
            res.json({ message: 'User created successfully', errorCode: 1 })
        }
    })
})

app.put('/users/:id', (req, res) => {

    const userId = req.params.id;
    const updatedEmail = req.body.email

    connection.query('UPDATE users SET email = ? WHERE id = ?', [updatedEmail, userId], (err, result) => {
        if(err) {
            res.json({ message: 'Server error', errorCode: 0 });
        }
        else {
            if(result.affectedRows < 1) {
                res.json({ message: 'User was not found or user was not updated', errorCode: 2 })
            }
            else {
                res.json({ message: 'User updated successfully', errorCode: 1 })
            }
        }
    });
})

app.delete('/users/:id', (req, res) => {

    const userId = req.params.id;

    connection.query('DELETE FROM users WHERE id = ?', userId, (err, result) => {
        if(err) {
            res.json({ message: 'Server error', errorCode: 0 });
        }
        else {
            if(result.affectedRows < 1) {
                res.json({ message: 'User was not deleted or user was not found', errorCode: 2 })
            }
            else {
                res.json({ message: 'User deleted successfully', errorCode: 1 })
            }
        }
    });
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
        if(err) {
            res.json({ message: 'Server error', errorCode: 0 });
        }
        else {
            res.json(result)
        }
    })
})

app.get('/users/:id', (req, res) => {

    const userId = req.params.id;

    connection.query('SELECT * FROM users WHERE id = ?', userId, (err, result) => {
        
        if(err) {
            res.json({ message: 'Server error', errorCode: 0 });
        }
        else {
            if(result.length < 1) {
                res.json({ message: "No user found", errorCode: 404 })
            }
            else {
                res.json(result)
            }
        }
    })
})

//close the connection kono
function closeConnection() {
    connection.end((err) => {
        if(err) {
            console.error('Error closing MYSQL connection', err);
        }
        else {
            console.log('MYSQL connection closed');
        }
    })
}




