const express = require('express');
const { readFile, appendFileSync } = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const app = express();
var cors = require("cors");

app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));

const { Client } = require('pg');
const client = new Client({
    user: "hjvtvdaqwbctgc",
    password: "7a412bc60c6149eb762f1785e8069bb9113455beb89dd2fc17f0141a5ebfb100",
    host: "ec2-52-208-254-158.eu-west-1.compute.amazonaws.com",
    port: 5432,
    database: "dcmps79tnu40t6",
    ssl: { rejectUnauthorized: false }
})


app.post('/lol', (request, response) => {

    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }
    console.log("lol");
    response.json({ count: 5 });

});

app.get('/', (request, response) => {
    client.connect();
    if (false) {
        readFile('./login.html', 'utf8', (err, html) => {

            if (err) {
                response.status(500).send('Error occured');
            }

            response.send(html);

        })
    }
    if (true) {
        readFile('./index.html', 'utf8', (err, html) => {

            if (err) {
                response.status(500).send('Error occured');
            }

            response.send(html);

        })
    }
});

app.post('/lol', (request, response) => {

    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }
    console.log("lol");
    response.json({ count: 5 });

});

app.use(express.json())

app.post('/data', async (request, response) => {

    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }

    console.log(request.body.id);

    const result = await getTable(request.body.id);

    console.table(result);
    response.json(result);

})




app.post('/login', async (request, response) => {

    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }

    var email = request.body.email;
    var passwort = request.body.passwort;

    const result = await client.query("SELECT * from nutzer WHERE nutzer.email = $1 AND nutzer.passwort = $2", [email, passwort]);
    if (result.rows.length > 0) {
        console.log(result.rows.length);
        request.session.loggedin = true;
        request.session.username = email;
        response.redirect('/');
    }
    
    console.table(result.rows);
    response.json(result.rows);

})



app.put('/add', async (request, response) => {

    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }

    const obj = request.body;
    insertD(obj);
    response.json({ message: "done" });

})



async function getLogin(email, passwort) {


    //await client.connect()
    console.log("Connected")
    const result = await client.query("SELECT * from nutzer WHERE nutzer.email = $1 AND nutzer.passwort = $2", [email, passwort])
    //await client.end()

    return result.rows;

}


async function getTable(id) {



    try {
        console.log(id);
        const result = await client.query("SELECT * from reisen WHERE reisen.nid = $1", [id])
        return result.rows;

    } catch (ex) {
        console.log(ex);
    }

}


async function insertD(obj) {

    try {
        await client.query("BEGIN")
        await client.query("INSERT INTO reisen VALUES ($1, $2, $3, $4, $5, $6)", [obj.id, obj.rname, obj.rland, obj.sdate, obj.edate, obj.nid])
        await client.query("COMMIT")
    
    } catch (ex) {
        console.log(ex)
    }
}
