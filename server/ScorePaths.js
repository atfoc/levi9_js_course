const {ScoreController} = require("./ScoreController");
const static = require('express').static;

function setupPaths(expressApp) {
    setupGetHighScores(expressApp);
    setupPostHighScore(expressApp);
    setPublicServe(expressApp);
}

function setupGetHighScores(expressApp){
    expressApp.get('/highScores', (request, response)=> {
        let top = request.query.top;

        if(top === null)
        {
            top = undefined;
        }
        else if(top !== undefined && typeof(top) !== 'number')
        {
            if(typeof(top) === 'string')
            {
                top = parseInt(top, 10);
                if(isNaN(top))
                {
                    response.send(400, 'top parameter must be a number');
                    return;
                }
            }
        }

        new ScoreController().getHighScores(response, top);
    })
}

function setupPostHighScore(expressapp){
    expressapp.post('/highScores', (request, response)=> {
        let data = request.body;

        const errorMessage = 'Request must contain json data {nickname: string, score: number}';
        if(data === undefined || data === null)
        {
            response.send(400, errorMessage);
            return ;
        }

        if(data.nickname === undefined || data.nickname === null || typeof(data.nickname) !== 'string')
        {
            response.send(400, errorMessage);
            return ;
        }

        if(data.score === undefined || data.score === null || typeof(data.score) !== 'number')
        {
            response.send(400, errorMessage);
            return ;
        }

        new ScoreController().addHighScore(response, data.nickname, data.score);

    })
}

function setPublicServe(expressApp) {
    expressApp.use(static('public'))
}

module.exports = {setupPaths: setupPaths};
