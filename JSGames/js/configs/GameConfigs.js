/**
 * Created by jonathan otalora - A00894017 on 15-04-18.
 */

/**
 * Game Config Object for storing game configs
 * @type {{debug: boolean}}
 */
var GameConfigs =  {
    debug: true,
    target: 'game_container',
    guessNum: {
        inputElm: 'uInput',
        resultElm: 'result'
    },

    pong: {
       throttleVel: 20,
        mainRadius: 30,
        lPadColor: '#7FFF00',
        rPadColor: '#1E90FF',
        PAD_WIDTH: 8, PAD_HEIGHT: 80
    },

    simpleGui: {
        mainFrame: 'canvas'
    }
};