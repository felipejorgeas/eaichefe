function findRecipes(ingredientsList, callback) {
    var trimmedList = ingredientsList.map(strTrim);
    var perfectLength = trimmedList.length;
    var query = {tags: {$all: trimmedList}};
    db.collection('receitas').find(query).toArray(function (err, docs) {
        var perfectMatchs = [];

        for (var i = 0; i < docs.length; i++) {
            if (docs[i].tags.length === perfectLength) {
                perfectMatchs.push(docs[i]);
            }
        }
        if (perfectMatchs.length > 0) {
            return callback({
                isSuggestion: false,
                recipes: perfectMatchs
            });
        } else {
            return callback({
                isSuggestion: true,
                recipes: docs
            });
        }
    });
}

function findRecipeSelected(id, callback) {
    var query = {_id: id}
    db.collection('receitas').find(query).toArray(function (err, docs) {
        if (err) {
            console.log('dio un error buscando en el banco de datos')
            return callback(err);
        } else {
            return callback({
                recipes: docs[0]
            });
        }
    });
}

function strTrim(str) {
    return str.trim();
}


module.exports = {
    findRecipes: findRecipes,
    findRecipeSelected: findRecipeSelected
};
