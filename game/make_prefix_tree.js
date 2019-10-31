const fs = require('fs');

function addToPrefixTree(tree, word)
{
    if(word.length === 0)
    {
        return;
    }

    for(let i in word)
    {
        let  letter = word[i].toUpperCase();
        if(tree[letter] === undefined)
        {
            tree[letter] = {final: false}
        }

        tree = tree[letter];
    }

    tree.final = true;
}




let words = fs.readFileSync('reci.txt', 'utf-8');

words = words.split('\n');

let tree = {final: false};

for(let word of words)
{

    addToPrefixTree(tree, word);
}

fs.writeFileSync('prefix_tree.json', JSON.stringify(tree));

