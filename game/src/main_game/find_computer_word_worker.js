onmessage = function (message)
{
    let prefixTree  = message.data.prefixTree;
    let allowedLetters = message.data.allowedLetters;

    let result = {word: []};

    let stack = [{tree: prefixTree, word: [], lettersLeft: allowedLetters}];


    while(stack.length > 0)
    {
        let top = stack.pop();

        if(top.tree.final)
        {
            if(top.word.length > result.word.length)
            {
                result.word = top.word;
            }
        }

        for(let letter in top.lettersLeft)
        {
            letter = parseInt(letter, 10);
            if(top.tree[top.lettersLeft[letter]] !== undefined)
            {
                stack.push({tree: top.tree[top.lettersLeft[letter]],
                    word: top.word.concat([top.lettersLeft[letter]]),
                    lettersLeft: (top.lettersLeft.slice(0, letter)).concat(top.lettersLeft.slice(letter+1))});
            }
        }
    }

    postMessage(result.word);
};

