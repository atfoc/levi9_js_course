const MongoClient = require('mongodb').MongoClient;
const promisify = require('util').promisify;

const connectPromisse = promisify(MongoClient.connect);
const url = 'mongodb://localhost:27017';
const dbName =  'scoresDB';
const collectionName =  'scores';

class ScoreController {


    getHighScores(response, limit){

        connectPromisse(url)
            .then((client)=> {
                const db = client.db(dbName);
                const collection = db.collection(collectionName);

                const projection = {
                        _id:false
                    };

                let cursor = collection.find({}).project(projection).sort({score: -1});

                if(limit !== undefined) {
                    cursor = cursor.limit(limit);
                }

                return promisify(cursor.toArray.bind(cursor))();
            })
            .then((result)=> {
                response.status(200).send(JSON.stringify(result));
            })
            .catch((error)=> {
                console.log(error);
                response.status(500).send();
            });
    }

    addHighScore(response, nickname, score){
        connectPromisse(url)
            .then((client)=> {
                const db = client.db(dbName);
                const collection = db.collection(collectionName);

                return promisify(collection.insertOne.bind(collection))({nickname: nickname, score: score});

            })
            .then(()=> {
                response.status(200).send();
            })
           .catch((error)=> {
                console.log(error);
                response.status(500).send();
            });
    }


}

module.exports = {ScoreController: ScoreController};
