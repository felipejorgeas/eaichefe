module.exports = function (request, databaseController) {
    var receitaController = {
        froms: [],
        receitaParser: function (userInput) {
            var itens = userInput.split(',');
            itens = itens.map(function (item) {
                return item.trim();
            });
            return itens;
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
        trataText: function (dataReceived, res) {
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
                receitaController.sendMessage(res, message);
            } else {
                var ingredientsList = receitaController.receitaParser(dataReceived.content);
                databaseController.findRecipes(ingredientsList, function (result) {
                    receitaController.trataData(dataReceived, res, result);
                });
            }
        },
        trataJson: function (dataReceived, res, data) {
            if (dataReceived.content.recipe && dataReceived.content.resp) {
                var recipeId = dataReceived.content.recipe;
                databaseController.findRecipeById(recipeId, function (result) {
                    receitaController.trataData(dataReceived, res, result);
                });
            } else {
                receitaController.trataData(dataReceived, res, []);
            }
        },
        trataData: function (dataReceived, res, data) {
            if (dataReceived.content.recipe && dataReceived.content.resp) {
                receita = data.recipes.pop();
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
                        }
                    ];
                }
            } else if (dataReceived.content.question === 1 && dataReceived.content.resp === 1) {
                var message = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "text/plain",
                    "content": "Por favor, informe os ingredientes separados por vírgula"
                };
            } else if (data.isSuggestion) {
                var message = [];
                var receitas = [];
                var item = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "text/plain",
                    "content": "Segue sugestões de receitas, hummm"
                };
                message.push(item);
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
                item = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "application/vnd.lime.collection+json",
                    "content": {
                        "text": "Segue sugestões de receitas, hummm",
                        "itemType": "application/vnd.lime.document-select+json",
                        "items": receitas
                    }
                };
                message.push(item);
            }
            if (message.hasOwnProperty(0)) {
                message.forEach(function (item) {
                    receitaController.sendMessage(res, item);
                });
            } else {
                receitaController.sendMessage(res, message);
            }
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
                if (body) {
                    console.log(body);
                }
            });
        }
    };
    return receitaController;
};
