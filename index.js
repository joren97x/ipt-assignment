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
    connection.query('INSERT INTO users SET ?', [req.body], (err, result) => {
        if(err) throw err;
        console.log('User added', result.insertId);
    })
})

app.put('/users/:id', (req, res) => {

    const userId = req.params.id;
    const updatedEmail = req.body.email

    connection.query('UPDATE users SET email = ? WHERE id = ?', [updatedEmail, userId], (err, result) => {
        if(err) throw err;
        console.log('User updated', result.affectedRows);
    });
})

app.delete('/users/:id', (req, res) => {

    const userId = req.params.id;

    connection.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if(err) throw err;
        console.log('User deleted', result.affectedRows);
    });
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', [], (err, result) => {
        if(err) throw err;
        res.json(result);
    })
})

app.get('/users/:id', (req, res) => {

    const userId = req.params.id;

    connection.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
        if(err) throw err;
        console.log(result);
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




