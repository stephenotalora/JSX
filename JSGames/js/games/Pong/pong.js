/**
 * Created by jonathan otalora - A00894017 on 15-04-26.
 */
var Pong = (function(){
    var canvas = null;
    var util = GameUtil;
    var PAD_WIDTH = util.config.pong.PAD_WIDTH;
    var PAD_HEIGHT = util.config.pong.PAD_HEIGHT;
    var TABLE_WIDTH = 0, TABLE_HEIGHT = 0, SCALE_FACTOR = 2;

    var leftPaddle = null, paddle_L_vel=0;
    var rightPaddle = null, paddle_R_vel=0;
    var ball = null;
    var keyMap = null;

    // private methods
    /**
     * simple math to position elements on the table
     */
    function initGameElms(){
        // table dimensions
        TABLE_WIDTH = canvas.getWidth();
        TABLE_HEIGHT = canvas.getHeight();

        // paddles
        var HALF_PAD_HEIGHT =  PAD_HEIGHT / SCALE_FACTOR;
        var HALF_TABLE_HEIGHT = TABLE_HEIGHT / SCALE_FACTOR;

        var yStart = HALF_TABLE_HEIGHT - HALF_PAD_HEIGHT;
        var yEnd   = (HALF_TABLE_HEIGHT + PAD_HEIGHT) - HALF_PAD_HEIGHT;
        var paddle_L_pos = [ // initial left paddle position
            [1, yStart], // start at pos x = 1, y = MIDDLE OF TABLE - THE HALF THE PAD OF PADDLE
            [1, yEnd] // end at x = 1, y = HALF OF TABLE + THE OTHER HALF OF PAD.
        ];
        leftPaddle = new Paddle(
            paddle_L_pos, paddle_L_vel,
            util.config.pong.PAD_WIDTH,
            util.config.pong.lPadColor
        );

        var xPos = TABLE_WIDTH - 1;
        var paddle_R_pos = [
            [xPos, yStart], [xPos, yEnd]
        ];
        rightPaddle = new Paddle(
            paddle_R_pos, paddle_R_vel,
            util.config.pong.PAD_WIDTH,
            util.config.pong.rPadColor
        );

        // init ball
        ball = new Ball(
            [TABLE_WIDTH/2, TABLE_HEIGHT/2], 0,
            util.config.pong.mainRadius
        );
    }

    function initPongTable(ctx) {
        // draw middle of table:
        Graphics.draw.line(ctx,
            [TABLE_WIDTH/2,0],
            [TABLE_WIDTH/2, TABLE_HEIGHT],
            SCALE_FACTOR
        );

        // draw gutters:
        Graphics.draw.line( // left gutter
            ctx,
            [PAD_WIDTH, 0],
            [PAD_WIDTH, TABLE_HEIGHT],
            SCALE_FACTOR
        );

        Graphics.draw.line(
            ctx,
            [TABLE_WIDTH - PAD_WIDTH, 0],
            [TABLE_WIDTH - PAD_WIDTH, TABLE_HEIGHT],
            SCALE_FACTOR
        );
    }

    function draw(ctx){
        initPongTable(ctx);
        ball.draw(ctx, true);

        // perform logic here
        updatePaddlePos(leftPaddle.getPosition(), paddle_L_vel);
        updatePaddlePos(rightPaddle.getPosition(), paddle_R_vel);
        leftPaddle.draw(ctx);
        rightPaddle.draw(ctx);
    }

    function updatePaddlePos(paddlePos, paddleVel){
        if (arguments.length != 2) throw 'pong two arguments required!';
        else if (!Array.isArray(paddlePos)) throw 'must pass array as paddle position!';

        // otherwise
        // update paddle position and keep paddles in table
        // to accomplish this check multidimentional array of paddle position
        if((paddlePos[0][1] >= 1 || paddleVel > 0) &&
            (paddlePos[1][1] <= (TABLE_HEIGHT - 1)  || paddleVel < 0)){
            paddlePos[0][1] += paddleVel;
            paddlePos[1][1] += paddleVel;
        }
    }

    function getControlMapping(isKeyDown) {
        var THROTTLE_VEL = util.config.pong.throttleVel;
        return {
            'W': function() {
                if (isKeyDown) paddle_L_vel = -THROTTLE_VEL;
                else paddle_L_vel = 0;
            },
            'S': function() {
                if (isKeyDown) paddle_L_vel = THROTTLE_VEL;
                else paddle_L_vel = 0;
            },
            'UP': function() {
                if(isKeyDown) paddle_R_vel = -THROTTLE_VEL;
                else paddle_R_vel = 0;
            },
            'DOWN': function() {
                if(isKeyDown) paddle_R_vel = THROTTLE_VEL;
                else paddle_R_vel = 0;
            }
        }
    }

    function onKeyDown(e) {
        var code = keyMap[e.keyCode];
        if (code) getControlMapping(true)[code]();
    }
    function onKeyUp(e) {
        var code = keyMap[e.keyCode];
        if (code) getControlMapping(false)[code]();
    }

    return {
        init: function () {
            canvas = Graphics.createCanvas("Pong", [900, 600]);
            keyMap = canvas.getKeyMap();
            initGameElms();

            canvas.focus();
            canvas.setBackgroundColor('black');
            canvas.setDrawHandler(draw);
            canvas.registerKeyDownListener(onKeyDown);
            canvas.registerKeyUpListener(onKeyUp);
            canvas.start();
        }
    }
})();

window.addEventListener('load', function() {
    Pong.init();
}, false);

