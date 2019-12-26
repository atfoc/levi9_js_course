var Main_game_ChooseLettersControler_ALL_LETTERS =  [
    "B", "C", "Č", "Ć", "D", "Đ", "DŽ",
    "F", "G", "H", "J", "K", "L", "M", "N", "LJ", "NJ",
     "P", "R", "S", "Š", "T",  "V", "Z", "Ž"
];

let Main_game_ChooseLettersController_VOWELS = [
    'A', 'E', 'I', 'O', 'U'
];
const Main_game_ChooseLettersController_NUMBER_OF_VOWELS = 4;

var Main_game_ChooseLettersControler_LETTERS_COUNT =  12;
var Main_game_PlayController_PREFEX_TREE_URL = 'prefix_tree.json';
var Main_game_WORKER_FIND_COMPUTER_WORD = 'src/main_game/find_computer_word_worker.js';


function Main_game_ChooseLettersController(ui, prefixTree)
{
    this.mLetters = new LiveData([]);
    this.mCurrentLetter = new LiveData(0);
    this.mNextPage = new LiveData(false);
    this.mTimer = -1;

    if(ui === undefined || ui === null)
    {
        ui = {};
    }

    if(prefixTree === undefined)
    {
        prefixTree = null;
    }

    this.mUi = ui;
    this.mPrefixTree = prefixTree;

    /*Appending to end of event loop so that we are sure that ui is already connected to livedata*/
    setTimeout(function ()
    {
        this.mTimer = setInterval(function ()
        {
            this.mCurrentLetter.setData(function (wrappedLetter)
            {
                if(this.mLetters.getData().length< Main_game_ChooseLettersController_NUMBER_OF_VOWELS)
                {
                    wrappedLetter.data = Math.floor(Math.random() *(Main_game_ChooseLettersController_VOWELS.length-1));
                }
                else
                {
                    wrappedLetter.data =
                         Math.floor(Math.random()*(Main_game_ChooseLettersControler_ALL_LETTERS.length-1));
                }
            }.bind(this));
        }.bind(this), 100);
    }.bind(this), 0);


}

Main_game_ChooseLettersController.prototype = Object.create(Controller.prototype);
Main_game_ChooseLettersController.prototype.tearDown = function ()
{
    this.mLetters.blockNotifications(true);
    this.mCurrentLetter.blockNotifications(true);
    this.mNextPage.blockNotifications(true);

    if(this.mTimer !== -1)
    {
        clearInterval(this.mTimer);
    }
};

Main_game_ChooseLettersController.prototype.chooseLetter = function ()
{
    this.mLetters.setData(function (wrappedLetters)
    {
        if(wrappedLetters.data.length < Main_game_ChooseLettersControler_LETTERS_COUNT)
        {
            if(wrappedLetters.data.length < Main_game_ChooseLettersController_NUMBER_OF_VOWELS)
            {
                wrappedLetters.data.push(Main_game_ChooseLettersController_VOWELS[this.mCurrentLetter.getData()]);
            }
            else
            {
                wrappedLetters.data.push(Main_game_ChooseLettersControler_ALL_LETTERS[this.mCurrentLetter.getData()]);
            }
        }
    }.bind(this));

    if(this.mLetters.letters >= Main_game_ChooseLettersController_NUMBER_OF_VOWELS)
    {
        this.mCurrentLetter.setData(Math.floor(Math.random()*(Main_game_ChooseLettersControler_ALL_LETTERS.length-1)));
    }

    if(this.mLetters.getData().length >= Main_game_ChooseLettersControler_LETTERS_COUNT)
    {
        this.mNextPage.setData(true);
    }
};

Main_game_ChooseLettersController.prototype.getLetters = function ()
{
    return new ImmutableLiveData(this.mLetters);
};

Main_game_ChooseLettersController.prototype.getCurrentLetter = function ()
{
    return new ImmutableLiveData(this.mCurrentLetter);
};

Main_game_ChooseLettersController.prototype.isNextPage = function ()
{
    return new ImmutableLiveData(this.mNextPage);
};

/*====================================================================================================================*/
function Main_game_InitialController()
{
    this.mUi = Main_game_makeUi();
    this.mNextPage = new LiveData(false);
    this.mPrefixTree = null;

    fetch(Main_game_PlayController_PREFEX_TREE_URL)
        .then(function (response)
        {
            if(response.ok)
            {
                response.json()
                    .then(function (json)
                    {
                        this.mPrefixTree = json;
                        setTimeout(function ()
                        {
                            this.mNextPage.setData(true);
                        }.bind(this), 0);
                    }.bind(this));
            }
        }.bind(this))
}

Main_game_InitialController.prototype = Object.create(Controller.prototype);
Main_game_InitialController.prototype.tearDown = function ()
{
};

Main_game_InitialController.prototype.addToBody = function ()
{
    document.body.append(this.mUi.div);
};

Main_game_InitialController.prototype.isNextPage = function ()
{
    return new ImmutableLiveData(this.mNextPage);
};


/*====================================================================================================================*/
function Main_game_PlayController(ui, chosenLetters, prefixTree)
{
    this.mUi = ui;
    this.mChosenLetters = chosenLetters;
    this.mPlayedLetters = new LiveData([]);
    this.mGrayedOut = new LiveData([]);
    this.mTransformMap = {};
    this.mTotalTime = 90;
    this.mTimeLeft = new LiveData(this.mTotalTime);
    this.mTimer = -1;
    this.mNextPage = new LiveData(false);

    if(prefixTree === undefined)
    {
        prefixTree = null;
    }

    this.mPrefixTree = prefixTree;

    setTimeout(function ()
    {
        this.mTimer = setInterval(function ()
        {
            if(this.mTimeLeft.getData() > 0)
            {
                this.mTimeLeft.setData(function (wrappedTime)
                {
                    wrappedTime.data -= 1;
                });
            }

        }.bind(this), 1000);
    }.bind(this), 0);

    this.mTimeLeft.observe(function (timeLeft)
    {
        if(timeLeft <= 0 && this.mTimer !== -1)
        {
            setTimeout(function ()
            {
                this.done();
            }.bind(this), 0);
        }
    }.bind(this));

    this.mComputerWord = new Promise(function (resolve)
    {
        var wrappedWorker = {worker: new Worker(Main_game_WORKER_FIND_COMPUTER_WORD)};
        wrappedWorker.worker.postMessage({prefixTree: this.mPrefixTree, allowedLetters: this.mChosenLetters});

        wrappedWorker.worker.onmessage = function (result)
        {

            resolve(result);
            if(wrappedWorker.worker !== null)
            {
                wrappedWorker.worker.terminate();
                wrappedWorker.worker = null;
            }
        };
    }.bind(this));

    this.mIsPlayerWordValid = false;
}

Main_game_PlayController.prototype = Object.create(Controller.prototype);
Main_game_PlayController.prototype.tearDown = function ()
{
    this.clearTimer();

    this.mPlayedLetters.blockNotifications(true);
    this.mGrayedOut.blockNotifications(true);
    this.mNextPage.blockNotifications(true);
};

Main_game_PlayController.prototype.getPlayedLetters = function ()
{
    return new ImmutableLiveData(this.mPlayedLetters);
};

Main_game_PlayController.prototype.getGrayedOutLetters = function ()
{
    return new ImmutableLiveData(this.mGrayedOut);
};

Main_game_PlayController.prototype.getTimeLeft = function ()
{
    return new ImmutableLiveData(this.mTimeLeft);
};

Main_game_PlayController.prototype.clearTimer = function ()
{
    if(this.mTimer !== -1)
    {
        clearInterval(this.mTimer);
        this.mTimer = -1;
    }
};

Main_game_PlayController.prototype.playLetter = function (position)
{
    var fromPosition = position;
    var toPosition = this.mPlayedLetters.getData().length;

    this.mGrayedOut.setData(function (wrappedData)
    {
        wrappedData.data.push(position);
    });

    this.mPlayedLetters.setData(function (wrappedLetters)
    {
        wrappedLetters.data.push(this.mChosenLetters[position]);
    }.bind(this));

    this.mTransformMap[toPosition] = fromPosition;
};


Main_game_PlayController.prototype.unPlayLetter = function (position)
{
    if(this.mTransformMap[position] !== undefined)
    {
        this.mPlayedLetters.setData(function (wrappedLetters)
        {
            wrappedLetters.data.splice(position, 1);
        });

        this.mGrayedOut.setData(function (wrappedGrayed)
        {
            // wrappedGrayed.data = wrappedGrayed.data.splice(this.mTransformMap[position], 1);
            var index = wrappedGrayed.data.findIndex(function(value){return value === this.mTransformMap[position]}.bind(this));

            if(index !== -1)
            {
                wrappedGrayed.data.splice(index, 1);
            }

        }.bind(this));

        delete  this.mTransformMap[position];
        var tmp = {};
        var key1= null;

        for(var key of Object.keys(this.mTransformMap))
        {
            if(key > position)
            {
                key1 = key-1;
            }
            else
            {
                key1 = key;
            }
            tmp[key1] = this.mTransformMap[key];
        }

        this.mTransformMap = tmp;
    }
};

Main_game_PlayController.prototype.done = function ()
{
    this.clearTimer();
    this.mIsPlayerWordValid = Main_game_PlayController_isUserWordValid(this.mPlayedLetters.getData(), this.mPrefixTree);
    this.mNextPage.setData(true);
};

function  Main_game_PlayController_isUserWordValid(word, prefixTree)
{
    if(word.length === 0)
    {
        return false;
    }

    word = word.slice();
    while(prefixTree !== undefined && word.length > 0)
    {
        prefixTree = prefixTree[word[0]];
        word.shift();
    }

    return (prefixTree !== undefined && prefixTree['final']);
}

/*====================================================================================================================*/
function Main_game_ScoreController(ui, playerWord, promiseComputerWord, isUserWordValid)
{
    this.mUi = ui;
    this.mPlayerWord = playerWord;
    this.mIsPlayerWordValid = isUserWordValid;
    this.mComputerWord = new LiveData(null);
    this.mPoints = new LiveData(0);
    this.mSubmitPoints = new LiveData(null);


    setTimeout(function ()
    {
        promiseComputerWord.then(function (message)
        {
            this.mComputerWord.setData(message.data);
            this.mPoints.setData(
                Main_game_ScoreController_calculatePoints(this.mIsPlayerWordValid, this.mPlayerWord, message.data));
        }.bind(this));
    }.bind(this), 0);

}


Main_game_ScoreController.prototype = Object.create(Controller.prototype);
Main_game_ScoreController.prototype.tearDown = function()
{

};

Main_game_ScoreController.prototype.getComputerWord = function ()
{
    return new ImmutableLiveData(this.mComputerWord);
};

Main_game_ScoreController.prototype.getPoints = function ()
{
    return new ImmutableLiveData(this.mPoints);
};

Main_game_ScoreController.prototype.getSubmitPoints = function ()
{
    return new ImmutableLiveData(this.mSubmitPoints);
};

Main_game_ScoreController.prototype.setWantToSubmitScore = function (choice)
{
    this.mSubmitPoints.setData(choice);
};

Main_game_ScoreController.prototype.submitScore = function ()
{
    return new Promise(function (resolve)
    {
        const req = new XMLHttpRequest();
        req.open('POST', 'http://localhost:3000/highscores');
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify({nickname: this.mUi.txtNick.value, score: this.mPoints.getData()}));

        setTimeout(()=>{resolve()}, 1000);
    }.bind(this));
};

function Main_game_ScoreController_calculatePoints(isPlayerWordValid, playerWord, computerWord)
{
    let points = 0;
    if(!isPlayerWordValid)
    {
        return 0;
    }

    return playerWord.length*2 + ((computerWord.length === playerWord.length) ? 3 : 0) +
        ((playerWord.length > computerWord.length) ? 6 : 0);
}

