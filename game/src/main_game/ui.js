function Main_game_makeUi()
{
    var ui = {};

    ui.div = document.createElement('div');
    ui.div.classList.add('col');

    ui.progressBar = document.createElement('div');
    ui.progressBar.classList.add('progress-bar');

    ui.progressBarInner = document.createElement('div');
    ui.progressBarInner.classList.add('progress-bar-inner');
    ui.progressBar.append(ui.progressBarInner);

    ui.btnStop = document.createElement('button');
    ui.btnStop.textContent = 'Stop';


    var res = Main_game_makeLetters(Main_game_ChooseLettersControler_LETTERS_COUNT);
    ui.divForChoosingLetters = res.container;
    ui.lettersDivs = res.letters;

    res = Main_game_makeLetters(Main_game_ChooseLettersControler_LETTERS_COUNT);
    ui.divForPlayingLetters = res.container;
    ui.playingLettersDivs = res.letters;


    res = Main_game_makeLetters(Main_game_ChooseLettersControler_LETTERS_COUNT);

    ui.divForComputerWord = res.container;
    ui.computerLettersDivs = res.letters;

    ui.btnDone = document.createElement('button');
    ui.btnDone.textContent = 'Done';

    ui.btnPlayAgain = document.createElement('button');

    ui.btnPlayAgain.textContent  = 'Play again';

    ui.divIsPlayerWordValid = document.createElement('div');

    ui.divForPoints = document.createElement('div');

    ui.div.append(
        ui.btnStop,
        ui.progressBar,
        ui.divForChoosingLetters,
        ui.divForPlayingLetters,
        ui.divForComputerWord,
        ui.btnDone,
        ui.divIsPlayerWordValid,
        ui.divForPoints,
        ui.btnPlayAgain
        );

    return ui;
}

function Main_game_makeLetters(numOfLetters)
{
    var container = document.createElement('div');
    var letters = [];

    container.classList.add('row');

    for(var i = 0 ; i < numOfLetters; ++i)
    {
        var tmp = document.createElement('div');
        letters.push(tmp);
        tmp.classList.add('letter');
    }

    container.append(...letters);


    return {container: container, letters: letters} ;
}

function Main_game_mainControllerObsever(wrappedController)
{
    if(wrappedController.controller !== null && wrappedController.changeController !== null)
    {

        if(wrappedController.controller instanceof  Main_game_InitialController)
        {
            document.body.innerHTML = '';
            wrappedController.controller.isNextPage().observe(function ()
            {
                setTimeout(function ()
                {
                    if(wrappedController.controller === null || wrappedController.changeController === null)
                    {
                        return;
                    }
                    wrappedController.controller.addToBody();
                    wrappedController.changeController(
                        new Main_game_ChooseLettersController(wrappedController.controller.mUi,
                            wrappedController.controller.mPrefixTree));
                }, 0);

            });
            // wrappedController.controller.addToBody();
            // wrappedController.changeController(new Main_game_ChooseLettersController(wrappedController.controller.mUi));
        }
        else if(wrappedController.controller instanceof Main_game_ChooseLettersController)
        {
            removeAllClickListeners(wrappedController.controller.mUi);
            showHideUi(wrappedController.controller.mUi, ['div', 'btnStop', 'divForChoosingLetters']);

            wrappedController.controller.isNextPage().observe(function ()
            {
                setTimeout(function ()
                {
                    if(wrappedController.changeController !== null)
                    {
                        wrappedController.changeController(
                            new Main_game_PlayController(wrappedController.controller.mUi,
                                wrappedController.controller.getLetters().getData(),
                                wrappedController.controller.mPrefixTree));
                    }
                }, 0);

            });

            wrappedController.controller.getCurrentLetter().observe(function (currentLetter)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                if(wrappedController.controller.getLetters().getData().length< Main_game_ChooseLettersController_NUMBER_OF_VOWELS)
                {
                    wrappedController.controller.mUi
                        .lettersDivs[wrappedController.controller.getLetters().getData().length].innerText =
                        Main_game_ChooseLettersController_VOWELS[currentLetter];
                }
                else if(wrappedController.controller.getLetters().getData().length < Main_game_ChooseLettersControler_LETTERS_COUNT)
                {
                    wrappedController.controller.mUi
                        .lettersDivs[wrappedController.controller.getLetters().getData().length].innerText =
                        Main_game_ChooseLettersControler_ALL_LETTERS[currentLetter];
                }

            });

            wrappedController.controller.getLetters().observe(function (letters)
            {
                for(var i in letters)
                {
                    wrappedController.controller.mUi.lettersDivs[i].innerText = letters[i];
                }
            });

            wrappedController.controller.mUi.btnStop.onclick = function ()
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                wrappedController.controller.chooseLetter();
            };

        }
        else if(wrappedController.controller instanceof Main_game_PlayController)
        {
            removeAllClickListeners(wrappedController.controller.mUi);
            showHideUi(wrappedController.controller.mUi,
                [
                    'div',
                    'divForChoosingLetters',
                    'divForPlayingLetters',
                    'progressBar',
                    'progressBarInner',
                    'btnDone'
                ]);


            var choosingLetterFunction = function(position)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                wrappedController.controller.playLetter(position)
            };

            var choosingPlayedLetterFunction = function(position)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                wrappedController.controller.unPlayLetter(position)
            };

            wrappedController.controller.getPlayedLetters().observe(function(playedLetters)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                for(var i in wrappedController.controller.mUi.playingLettersDivs)
                {
                    var value =  null;
                    if(i < playedLetters.length)
                    {
                        value =  playedLetters[i];
                    }
                    else
                    {
                        value = '' ;
                    }
                    wrappedController.controller.mUi.playingLettersDivs[i].innerText = value;
                }
            });

            wrappedController.controller.getGrayedOutLetters().observe(function (grayedOut)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                var value =  'grayed-out';
                for(var i in wrappedController.controller.mUi.lettersDivs)
                {
                    wrappedController.controller.mUi.lettersDivs[i].classList.remove(value);
                    wrappedController.controller.mUi.lettersDivs[i].onclick =
                        choosingLetterFunction.bind(this, parseInt(i, 10));
                }

                for(var i of grayedOut)
                {
                    wrappedController.controller.mUi.lettersDivs[i].onclick = null;
                    wrappedController.controller.mUi.lettersDivs[i].classList.add(value);
                }
            });

            wrappedController.controller.getTimeLeft().observe(function (timeLeft)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                var percentage = timeLeft*100/(wrappedController.controller.mTotalTime+1);

                wrappedController.controller.mUi.progressBarInner.style.width = percentage.toString(10) + '%';
            });

            wrappedController.controller.mNextPage.observe(function ()
            {
                if(wrappedController.changeController === null)
                {
                    return;
                }

                wrappedController.changeController(
                    new Main_game_ScoreController(wrappedController.controller.mUi,
                        wrappedController.controller.getPlayedLetters().getData(),
                        wrappedController.controller.mComputerWord, wrappedController.controller.mIsPlayerWordValid));
            });

            for(var i in wrappedController.controller.mUi.lettersDivs)
            {
                wrappedController.controller.mUi.lettersDivs[i].onclick = choosingLetterFunction.bind(this, parseInt(i, 10));
                wrappedController.controller.mUi.playingLettersDivs[i].onclick = choosingPlayedLetterFunction.bind(this, parseInt(i, 10));
            }

            wrappedController.controller.mUi.btnDone.onclick = function ()
            {
                wrappedController.controller.done();
            };
        }
        else if(wrappedController.controller instanceof  Main_game_ScoreController)
        {
            removeAllClickListeners(wrappedController.controller.mUi);
            showHideUi(wrappedController.controller.mUi,
                [
                    'div',
                    'divForChoosingLetters',
                    'divForPlayingLetters',
                    'divForComputerWord',
                    'btnPlayAgain',
                    'divIsPlayerWordValid',
                    'divForPoints'
                ]);

            wrappedController.controller.getComputerWord().observe(function (word)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                if(word !== null)
                {
                    for(let i in word)
                    {
                        wrappedController.controller.mUi.computerLettersDivs[i].innerText = word[i];
                    }
                }



            });

            wrappedController.controller.getPoints().observe(function (points)
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                wrappedController.controller.mUi.divForPoints.innerText = 'You have won ' + points.toString();
            });

            wrappedController.controller.mUi.btnPlayAgain.onclick = function ()
            {
                if(wrappedController.controller === null)
                {
                    return;
                }

                setTimeout(function ()
                {
                    if(wrappedController.changeController !== null)
                    {
                        wrappedController.changeController(new Main_game_InitialController());
                    }
                }, 0);
            };

            wrappedController.controller.mUi.divIsPlayerWordValid.innerText =
                (wrappedController.controller.mIsPlayerWordValid ? 'Your word is valid' : 'Your word is not valid');

            // document.body.innerText = wrappedController.controller.mIsPlayerWordValid;
        }
    }
}

