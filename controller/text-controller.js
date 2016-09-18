var presentation = [
    'Olá! Como vai? Eu sou Chefito. O chefe de cozinha que vai lhe ajudar a encontrar a receita ideal. Vamos lá?',
    'Opa! Tudo bem? Me chamo Chefito, sou chefe de cozinha e vou te ajudar a achar uma receita ideal. Borá lá?',
    'Olá! Tudo beleza? Bom, meu nome é Chefito e sou o chefe de cozinha que irá lhe ajudar a achar uma receita ideal. Vamos começar?'
];

var call = [
    'Oba! Vou procurar algumas receitas de acordo com os ingredientes que você tem.',
    'Legal! Agora eu vou procurar receitas relacionadas com os ingredientes que você tem aí.',
    'Isso aí :) De acordo com os ingredientes que você tem, eu vou procurar receitas relacionadas a eles.'
];

var ingredients = [
    'Digite para mim 3 ingredientes (ou mais) e separe cada um deles por vírgula.',
    'Escreva por favor, 3 ingredientes (ou mais) e separe-os por vírgula.',
    'Fale pra mim 3 ingredientes (ou mais) e separe cada um deles por vírgula.',
    'Escreva pelo menos 3 ingredientes e não esqueça de separá-los por vírgula (Confesso que já estou ansioso pra saber o que você tem aí :D)',
    'Digite pelo menos 3 ingredientes e não esqueça de separá-los por vírgula (Tô louco pra saber o que você tem ai :D)',
    'Fale ao menos 3 ingredientes e é importante não esquecer de separá-los por vírgula (minha ansiedade só cresce em saber o que você tem ai :D)'
];

var negative = [
    'Hum...perdão! Eu não entendi muito bem o que você escreveu :( Lembre-se que estou aqui para lhe ajudar a encontrar a receita ideal. Vamos tentar de novo.',
    'Vish...desculpe-me! Não compreendi ao certo o que você digitou :( Não se esqueça que tô aqui pra te auxiliar com a receita ideal. Vamos tentar novamente.',
    'Poxa, me desculpe mas não entendi direito o que você escreveu :/ Tô aqui pra te ajudar a encontrar a receita ideal, não se esqueça. Vamos tentar de novo.'
];



var yes = [
    'Ótimo! Vamos lá!',
    'Massa! Bora lá!',
    'Maravilha! Vamos lá!'
];

var no = [
    'Gostei de ter você por aqui. Se precisar de novas receitas é só me chamar. Chefito à disposição. Bom apetite :D',
    'Sempre que quiser, pode chamar o Chefito que estarei à disposição. Fiquei feliz em ter você por aqui. Bom apetite :D',
    'Se precisar encontrar uma receita, já sabe onde procurar. Chefito estará à disposição. Volte sempre e Bom apetite :D'
];


function resolveArray(array) {
    var index = Math.floor(Math.random() * array.length);
    return array[index];

}

function resolveText(intention) {

    switch (intention) {
        case 'APRESENTAÇÃO':
            //TODO
            return resolveArray(presentation)
            break;
        case 'CHAMADA':
            //TODO
            return resolveArray(call)
            break;
        case 'INGREDIENTES':
            //TODO
            return resolveArray(ingredients)
            break;
        case 'NEGATIVA':
            //TODO
            return resolveArray(negative)
            break;
        case 'SIM':
            //TODO
            return resolveArray(yes)
            break;
        case 'NÃO':
            //TODO
            return resolveArray(no)
            break;
    }

}

module.exports = {
    resolveText: resolveText
};
