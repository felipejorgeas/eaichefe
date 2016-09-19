module.exports = function (request, databaseController, textController) {
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
                        "text": textController.resolveText('APRESENTAÇÃO'),
                        "options": [{
                                "order": 1,
                                "text": textController.resolveText('SIM'),
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
        trataJson: function (dataReceived, res) {
            if (dataReceived.content.recipe && dataReceived.content.resp) {
                var recipeId = dataReceived.content.recipe;
                databaseController.findRecipeSelected(recipeId, function (result) {
                    receitaController.trataData(dataReceived, res, result);
                });
            } else {
                receitaController.trataData(dataReceived, res, []);
            }
        },
        trataData: function (dataReceived, res, data) {
            if (dataReceived.content.recipe && dataReceived.content.resp) {
                if (data && !data.hasOwnProperty(0)) {
                    var receita = data;
                    var message = [
                        {
                            "id": dataReceived.id,
                            "to": dataReceived.from,
                            "type": "text/plain",
                            "content": receita.titulo + '\nTempo de preparo:\n' + receita.tempo + '\n\nIngredientes:\n' + receita.ingredientes.join('\n')
                        },
                        {
                            "id": dataReceived.id,
                            "to": dataReceived.from,
                            "type": "text/plain",
                            "content": '\n\nModo de preparo:\n' + receita.preparo.join('\n')
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
                                        "text": "Sim",
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
                                            "question": 2,
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
                    "content": textController.resolveText('INGREDIENTES')
                };
            } else if (dataReceived.content.question === 2 && dataReceived.content.resp === 2) {
                var message = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "text/plain",
                    "content": textController.resolveText('NÃO')
                };
            } else if (data.recipes.length) {
                var msg = "Oba, encontrei estas receitas perfeitas para você! Tem todos os ingredientes que você me informou =)";
                if (data.isSuggestion) {
                    msg = "Tenho algumas sugestões de receitas com os ingredientes que você me informou (Y)";
                }
                var message = [];
                var receitas = [];
                var item = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "text/plain",
                    "content": msg
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
                        "itemType": "application/vnd.lime.document-select+json",
                        "items": receitas
                    }
                };
                message.push(item);
            } else if (!data.length) {
                var message = {
                    "id": dataReceived.id,
                    "to": dataReceived.from,
                    "type": "application/vnd.lime.select+json",
                    "content": {
                        "text": textController.resolveText('NEGATIVA'),
                        "options": [
                            {
                                "order": 1,
                                "text": textController.resolveText('SIM'),
                                "type": "application/json",
                                "value": {
                                    "question": 1,
                                    "resp": 1
                                }
                            }
                        ]
                    }
                };
            }
            if (message.hasOwnProperty(0)) {
                var delay = 0;
                message.forEach(function (item) {
                    delay += 1000;
                    receitaController.sendMessage(res, item, delay);
                });
            } else {
                receitaController.sendMessage(res, message, 0);
            }
        },
        sendMessage: function (res, message, delay) {
            setTimeout(function () {
                console.log(message);
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
            }, delay);
        }
    };
    return receitaController;
};
