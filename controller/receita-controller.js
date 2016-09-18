module.exports = function (request, databaseController) {
    var receitaController = {
        froms: [],
        receitaParser: function (userInput) {
            return userInput.split(',');
        },
        isFirstMessage: function (from) {
            var froms = receitaController.froms;
            if (froms.length) {
                froms = froms.filter(function (item) {
                    return (item === from);
                });
                if (froms.length) {
                    return false;
                }
            }
            receitaController.froms.push(from);
            return true;
        },
        trataText: function (dataReceived) {
            var message = {};
            if (receitaController.isFirstMessage(dataReceived.from)) {
                message = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "application/vnd.lime.select+json",
                    "content": {
                        "text": "Olá, eu sou o Chefito e vou te ajudar!",
                        "options": [{
                                "order": 1,
                                "text": "Vamos lá",
                                "type": "application/json",
                                "value": {
                                    "question": 1,
                                    "resp": 1
                                }
                            }]
                    }
                };
            } else {
                var ingredientsList = receitaController.receitaParser(dataReceived.content);
                databaseController.findRecipes(ingredientsList, function (result) {
                    console.log(result);
                    message = receitaController.trataData(dataReceived, result);
                });
            }
            return message;
        },
        trataJson: function (dataReceived, data) {
            var message = receitaController.trataData(dataReceived, []);
            return message;
        },
        trataData: function (dataReceived, data) {
            var data = receitaController.recipes;
            var message = {};
            if (dataReceived.content.recipe && dataReceived.content.resp) {
                var receitaId = dataReceived.content.recipe;
                var receita = data.recipes.filter(function (item) {
                    return (item._id === receitaId);
                });
                receita = receita.pop();
                if (receita) {
                    var message = [
                        {
                            "id": dataReceived.id,
                            "to": dataReceived.from,
                            "type": "text/plain",
                            "content": receita.titulo + 'Tempo de preparo:\n' + receita.tempo + '\n'
                        },
                        {
                            "id": dataReceived.id,
                            "to": dataReceived.from,
                            "type": "application/vnd.lime.select+json",
                            "content": {
                                "text": "Deseja buscar outras receitas?",
                                "options": [
                                    {
                                        "order": 1,
                                        "text": "Vamos lá",
                                        "type": "application/json",
                                        "value": {
                                            "question": 1,
                                            "resp": 1
                                        }
                                    },
                                    {
                                        "order": 2,
                                        "text": "Não, obrigado",
                                        "type": "application/json",
                                        "value": {
                                            "question": 1,
                                            "resp": 2
                                        }
                                    }
                                ]
                            }
                        },
                    ];
                }
            } else if (dataReceived.content.question === 1 && dataReceived.content.resp === 1) {
                message = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "text/plain",
                    "content": "Por favor, informe os ingredientes separados por vírgula"
                };
            } else if (data.isSuggestion) {
                var receitas = [];
                data.recipes.forEach(function (receita) {
                    var item = {
                        "header": {
                            "type": "application/vnd.lime.media-link+json",
                            "value": {
                                "title": receita.titulo,
                                "text": receita.tempo,
                                "type": "image/jpeg",
                                "uri": receita.img
                            }
                        },
                        "options": [
                            {
                                "label": {
                                    "type": "text/plain",
                                    "value": "Ver receita"
                                },
                                "value": {
                                    "type": "application/json",
                                    "value": {
                                        "recipe": receita._id,
                                        "resp": 1
                                    }
                                }
                            }
                        ]
                    };
                    receitas.push(item);
                });
                message = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "application/vnd.lime.collection+json",
                    "content": {
                        "text": "Segue sugestões de receitas, hummm",
                        "itemType": "application/vnd.lime.document-select+json",
                        "items": receitas
                    }
                };
            }
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
            });
        }
    };
    return receitaController;
};
