const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.listen(process.env.PORT || 8080);
