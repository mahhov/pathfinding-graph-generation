const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://manukhovanesian@localhost:5432/astar');

let incrementCount = () => {
    db.none('INSERT INTO count (count) VALUES (1)').catch((err) => {
        console.log('error updateing count table:');
        console.log(err);
    });
};

let wrapper = (req, res, next) => {
    if (req.url === '/')
        incrementCount();
    express.static(__dirname + '/public')(req, res, next);
};

app.use(wrapper);
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.get('/count', (req, res) => {
    db.one('SELECT count(*) from count').then((count) => {
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(count);
    }).catch(() => {
        res.status(400).send();
    });
});
app.listen(process.env.PORT || 8080);
