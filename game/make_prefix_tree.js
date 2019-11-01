const fs = require('fs');

function doesMakeCompundLetter(letter, nextLetter)
{
    if(letter === 'D' && nextLetter === 'Ž')
    {
        letter = 'DŽ';
        return true;
    }
    else if(letter === 'L' && nextLetter === 'J')
    {
        letter = 'LJ';
        return true;
    }
    else if(letter === 'N' && nextLetter === 'J')
    {
        letter = 'NJ';
        return true;
    }
    return false;
}

function addToPrefixTree(tree, word)
{
    if(word.length === 0)
    {
        return;
    }

    for(let i = 0; i < word.length; ++i)
    {
        let  letter = word[i].toUpperCase();
        if(i+1 < word.length)
        {
            let nextLetter = word[i+1].toUpperCase();

            if(doesMakeCompundLetter(letter, nextLetter))
            {
                ++i;
                letter = letter + nextLetter;
            }
        }

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

