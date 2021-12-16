const express = require('express');
const { readFile, appendFileSync } = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var cookieSession = require('cookie-session')
const app = express();
var cors = require("cors");

app.use(express.json())

app.use(cookieParser());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(session({
    name: "session-id",
    secret: "GFGEnter", // Secret key,
    saveUninitialized: false,
    resave: false,
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));


const { Client } = require('pg');
const req = require('express/lib/request');
const { response } = require('express');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})
client.connect();


app.get('/', (request, response) => {
    console.log(request.session.id);
    if (!request.session.user) {
        readFile('./login.html', 'utf8', (err, html) => {

            if (err) {
                response.status(500).send('Error occured');
            }

            response.send(html);

        })
    } else {
        readFile('./index.html', 'utf8', (err, html) => {

            if (err) {
                response.status(500).send('Error occured');
            }

            response.send(html);

        })
    }
});


app.use(express.json())

app.post('/data', async (request, response) => {

    if (request === undefined || !checkAuth(request)) {
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
    console.log(request.session);
       

    const result = await client.query("SELECT * from nutzer WHERE nutzer.email = $1 AND nutzer.passwort = $2", [email, passwort]);
    console.log(result.rows.length);

    if (result.rows.length > 0) {
        request.session.user = email;
        request.session.cookie.maxAge = 60*60*3600;
        console.log(request.session.user);
        response.json({ status: "ok", id: result.rows[0].id });
        
    } else {
    
        response.json({ status: 'not ok', message: "Bad email or password" });
    
    }
})

app.post('/logout', async(request, response)=>{
    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }
    request.session.destroy();
    response.status(200).clearCookie('session-id', {
      path: '/'
    });


})

app.post('/auth', async(request,response)=>{
    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }
    console.log(request.session);
    if (!request.session.id) {
        response.json({ auth: false});
    }else{
        response.json({auth: true});
    }

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



async function getTable(id) {


    try {
        console.log(id);
        const result = await client.query("SELECT * from reisen WHERE reisen.nid = $1", [id])
        return result.rows;

    } catch (ex) {
        console.log(ex);
    }

}

function checkAuth(req){
    if (!req.session.user) {
        return false;
    }else{
        return true;
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
