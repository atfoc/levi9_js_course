const express = require('express');
const bodyParser = require('body-parser');
const {setupPaths} = require('./ScorePaths');
const port = 3000;

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

setupPaths(app);


app.listen(3000);
