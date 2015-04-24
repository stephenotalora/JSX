/**
 * Created by jono on 15-04-19.
 */
var GuessNum = {
    chosenNum: 0,
    guessCounter: 0,
    settings: GameConfigs.guessNum, // ref to game configs

    /**
     * retrieves user input from view
     * @returns {value for input}
     */
    getUserInput: function() {
        var target = document.getElementById(this.settings.inputElm);
        return target ? parseInt(target.value) : undefined;
    },

    /**
     * Generates random number from 1 up to max
     * @param max
     * @returns {number}
     */
    generateNum: function(max) {
        return Math.floor(1 + (Math.random() * max));
    },

    /**
     * sets the random number for the current game
     * @param max
     */
    setRandom: function(max){
        this.chosenNum = this.generateNum(max);
    },

    /**
     * determines whether the data entered is valid or not
     * @returns {boolean}
     */
    hasValidData: function(val){
        return isNaN(val) ? false : true;
    },

    /**
     * returns a result form spec
     * @param pick
     * @returns {String value}
     */
    pickGameResult: function (pick) {
        var defaultStr = [
            'Wow mind reader, you guessed correctly on your first guess',
            'Not bad it only took you ' + this.guessCounter + ' guesses to guess the correct number',
            'You guessed correctly. It took you ' + this.guessCounter + ' guesses to guess the correct number'
        ];

        return defaultStr[pick];
    },

    gameResult: function() {
        var result = undefined;
        var attempts = { MIND_READER: 0, NOT_BAD: 1, DEFAULT_MSG: 2}

        switch(this.guessCounter){
            case 1:
                result = this.pickGameResult(attempts.MIND_READER);
                break;
            case 2:
            case 3:
            case 4:
            case 5:
                result = this.pickGameResult(attempts.NOT_BAD);
                break;
            default:
                result = this.pickGameResult(attempts.DEFAULT_MSG);
                break;
        }

        return result;
    },

    play: function() {
        ++this.guessCounter;
        var userChoice = this.getUserInput();

        if (this.hasValidData(userChoice)) {
            var resultElm = document.getElementById(this.settings.resultElm);

            if (userChoice == this.chosenNum){
                if (resultElm) resultElm.innerHTML = "";
                GameUtil.alert(this.gameResult());
                location.reload(); // TODO: PROMPT USER TO RELOAD PAGE
            } else if (userChoice < this.chosenNum){
                if (resultElm) resultElm.innerHTML = "Higger!";
            } else { // must be greate than
                if (resultElm) resultElm.innerHTML = "Lower!";
            }
        } else {
            GameUtil.alert("you have entered invalid data!");
        }
    }
};

window.addEventListener('load', function() {
    GuessNum.setRandom(100);
    document.getElementById('submit').addEventListener('click', GuessNum.play.bind(GuessNum), false);
}, false);