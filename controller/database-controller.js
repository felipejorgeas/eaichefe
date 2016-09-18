/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function findRecipes(ingredientsList, callback) {
    console.log('findRecipes: ', ingredientsList);
    var perfectLength = ingredientsList.length;
    var query = { tags: { $all: ingredientsList } };
    db.collection('receitas').find(query).toArray(function(err, docs) {
        if (err) {
            console.log('dio un error buscando en el banco de datos')
            return callback(err);
        } else {
            return callback({
            	isSuggestion: true,
            	recipes:docs
            })
        }
    });
}

module.exports = {
    findRecipes: findRecipes
};
