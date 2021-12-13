const express = require('express');
const { readFile, appendFileSync } = require('fs');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const app = express();


app.use(express.json())
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));

app.get('/', (request, response) => {

        readFile('./test.html', 'utf8', (err, html) => {

            if (err) {
                response.status(500).send('Error occured');
            }

            response.send(html);

        })
    }
);

/*app.post('/lol', (request, response) => {

    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }
    console.log("lol");
    response.json({ count: 5 });

});

app.get('/', (request, response) => {
    if (false) {
        readFile('./login.html', 'utf8', (err, html) => {

            if (err) {
                response.status(500).send('Error occured');
            }

            response.send(html);

        })
    }
    if(true){
        readFile('./index.html', 'utf8', (err, html) => {

            if (err) {
                response.status(500).send('Error occured');
            }

            response.send(html);

        })
    }
    //response.redirect('/lol');
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

    const result = await getTable(request.body.id);

    console.table(result);
    response.json(result);

})




app.post('/login', async (request, response) => {

    if (request === undefined) {
        response.status(400);
        return response.json({ message: "bad request" });
    }

    const client = new Client({
        user: "postgres",
        password: "abcd1234!",
        host: "localhost",
        port: 5433,
        database: "test"
    })

    var email = request.body.email;
    var passwort = request.body.passwort;

    await client.connect()
    console.log("Connected")
    const result = await client.query("SELECT * from nutzer WHERE nutzer.email = $1 AND nutzer.passwort = $2" , [email,passwort]);
    if(result.rows.length > 0){
        console.log(result.rows.length);
        request.session.loggedin = true;
        request.session.username = email;
        response.redirect('/');
    }
    await client.end()


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


app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));



//server.close();
const { Client } = require('pg');



async function getLogin(email, passwort){

    const client = new Client({
        user: "postgres",
        password: "abcd1234!",
        host: "localhost",
        port: 5433,
        database: "test"
    })

    await client.connect()
    console.log("Connected")
    const result = await client.query("SELECT * from nutzer WHERE nutzer.email = $1 AND nutzer.passwort = $2" , [email,passwort])
    await client.end()

    return result.rows;

}


async function getTable(id) {

    const client = new Client({
        user: "postgres",
        password: "abcd1234!",
        host: "localhost",
        port: 5433,
        database: "test"
    })


    await client.connect()
    console.log("Connected")
    const result = await client.query("SELECT * from reisen WHERE reisen.fid = $1", [id])

    await client.end()

    return result.rows;
}


async function insertD(obj) {

    const client = new Client({
        user: "postgres",
        password: "abcd1234!",
        host: "localhost",
        port: 5433,
        database: "test"
    })

    try {
        await client.connect();
        console.log("Connected")
        await client.query("BEGIN")
        await client.query("INSERT INTO reisen VALUES ($1, $2, $3, $4, $5, $6)", [obj.rid, obj.fid, obj.rland, obj.sdate, obj.edate, obj.rname])
        await client.query("COMMIT")
    } catch (ex) {
        console.log(ex)
    } finally {
        await client.end();
    }
}
*/
