var bodyParser = require('body-parser'),
        express = require('express'),
        request = require('request'),
        assert = require('assert'),
        databaseController = require(__dirname + '/controller/database-controller.js'),
        textController = require(__dirname + '/controller/text-controller.js'),
        receitaController = require(__dirname + '/controller/receita-controller.js')(request, databaseController, textController);

var api = '/eaichefe.api';
var port = 3333;

//Added by Carlos
var MongoClient = require('mongodb').MongoClient;
GLOBAL.ObjectId = require('mongodb').ObjectId; 
var connectionString = 'mongodb://10.12.201.62:27017/EiAiChef';

var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    next();
});

app.post(api + '/not', function (req, res) {
    //    console.log(req.body);
});

app.post(api + '/msg', function (req, res) {
    var dataReceived = req.body;
    var message = {};
    switch (dataReceived.type) {
        case 'text/plain':
            receitaController.trataText(dataReceived, res);
            break;
        case 'application/json':
            receitaController.trataJson(dataReceived, res);
            break;
    }
});

// Use connect method to connect to the Server 
MongoClient.connect(connectionString, function (err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");
    GLOBAL.db = db;
    app.listen(port, function () {
        console.log('Servidor escutando na porta ' + port);
    });
});
