/**
 * Created by jonathan otalora - A00894017 on 15-04-18.
 */

/**
 * Game Config Object for storing game configs
 * @type {{debug: boolean}}
 */
var GameConfigs =  {
    debug: true,
    guessNum: {
        inputElm: 'uInput',
        resultElm: 'result'
    },

    pong: {
        targetNode: 'game_container',
        mainFrame: 'canvas',
        throttleVel: 10.5,
        ballRadius: 25,
        lPadColor: '#7FFF00',
        rPadColor: '#1E90FF',
        PAD_WIDTH: 8.0, PAD_HEIGHT: 80.0,
        TABLE_WIDTH:900.0, TABLE_HEIGHT:600.0
    }
};