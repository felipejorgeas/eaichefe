var bodyParser = require('body-parser')
        , express = require('express')
        , request = require('request')
        , databaseController = require(__dirname + '/controller/database-controller.js')
        , receitaController = require(__dirname + '/controller/receita-controller.js')(request, databaseController);

var api = '/eaichefe.api';
var port = 3333;

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
            message = receitaController.trataText(dataReceived);
            break;
        case 'application/json':
            message = receitaController.trataJson(dataReceived);
            break;
    }
    receitaController.sendMessage(res, message);
});

app.listen(port, function () {
    console.log('Servidor escutando na porta ' + port);
});