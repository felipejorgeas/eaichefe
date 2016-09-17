module.exports = function (request, databaseController) {
    var receitaController = {
        ids: [],
        receitaParser: function (userInput) {
            return userInput.split(',');
        },
        isFirstMessage: function (id) {
            var ids = receitaController.ids;
            if (ids.length) {
                ids = ids.filter(function (item) {
                    return (item === id);
                });
                if (ids.length) {
                    return false;
                }
            }
            receitaController.ids.push(id);
            return true;
        },
        trataText: function (dataReceived) {
            if (receitaController.isFirstMessage(dataReceived.from)) {
                var message = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "application/vnd.lime.select+json",
                    "content": {
                        "text": "Olá, eu sou o Chefito e vou te ajudar!",
                        "options": [
                            {
                                "order": 1,
                                "text": "Vamos lá",
                                "type": "application/json",
                                "value": {
                                    "question": 1,
                                    "resp": 1
                                }
                            }
                        ]
                    }
                };
            } else {
                databaseController.findRecipes(receitaController.receitaParser(dataReceived.content), function (result) {
                    console.log(result);
                });
            }
            return message;
        },
        trataJson: function (dataReceived) {
            var message = {
                "id": dataReceived.id,
                "to": dataReceived.from,
                "type": "text/plain",
                "content": "Por favor, informe os ingredientes separados por vírgula"
            };
            return message;
        },
        sendMessage: function (res, message) {
            request({
                method: 'POST',
                uri: 'https://msging.net/messages',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Key ZWFpY2hlZmU6eE5hbnFDbFhaSWdHMmVuY0o5NGU='
                },
                body: message,
                json: true
            }, function (err, httpResponse, body) {
                console.log(err);
                console.log(body);
                return res.send('ok');
            });
        }
    };
    return receitaController;
};