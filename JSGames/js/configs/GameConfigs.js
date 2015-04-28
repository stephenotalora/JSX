/**
 * Created by jono on 15-04-18.
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
       throttleVel: 15,
        mainRadius: 30,
        lPadColor: '#7FFF00',
        rPadColor: '#1E90FF'
    },

    simpleGui: {
        mainFrame: 'canvas'
    }
};