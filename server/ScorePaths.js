import {ScoreController} from "./ScoreController";

export function setupPaths(expressApp) {
    setupGetHighScores();
    setupPostHighScore();
}

function setupGetHighScores(expressApp){
    expressApp.get('/highScores', (request, response)=> {
        let top = request.query.top;

        if(top === null)
        {
            top = undefined;
        }
        else if(typeof(top) !== 'number')
        {
            response.send(400, 'top parameter must be a number');
            return ;
        }

        new ScoreController().getHighScores(response, top);
    })
}

function setupPostHighScore(expressapp){
    expressapp.post('/highScores', (request, response)=> {
        let data = request.data;

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
