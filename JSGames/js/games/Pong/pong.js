/**
 * Created by jotalora on 15-04-26.
 */
var Pong = (function(){
    var canvas = null;
    var util = GameUtil;
    var PAD_WIDTH = 8,   PAD_HEIGHT = 80;
    var TABLE_WIDTH = 0, TABLE_HEIGHT = 0;
    var SCALE_FACTOR = 2;
    var paddle_L_pos = null, paddle_R_pos = null, ball_pos = null;
    var paddle_L_vel = 0, paddle_R_vel = 0;
    var ballRadius = 0, isFullRadius = false;
    var keyMap = null;

    // private methods
    function initGameElms(){
        // table dimensions
        TABLE_WIDTH = canvas.getWidth();
        TABLE_HEIGHT = canvas.getHeight();

        // paddles
        var HALF_PAD_HEIGHT = PAD_HEIGHT / 2;
        var HALF_TABLE_HEIGHT = TABLE_HEIGHT / 2;

        var yStart = HALF_TABLE_HEIGHT - HALF_PAD_HEIGHT;
        var yEnd   = (HALF_TABLE_HEIGHT + PAD_HEIGHT) - HALF_PAD_HEIGHT;
        paddle_L_pos = [ // initial left paddle position
            [1, yStart], // start at pos x = 1, y = MIDDLE OF TABLE - THE HALF THE PAD OF PADDLE
            [1, yEnd] // end at x = 1, y = HALF OF TABLE + THE OTHER HALF OF PAD.
        ];

        var xPos = TABLE_WIDTH - 1;
        paddle_R_pos = [
            [xPos, yStart], [xPos, yEnd]
        ];

        // ball initial position
        ball_pos = [TABLE_WIDTH/2, TABLE_HEIGHT/2];
        ballRadius = util.config.pong.mainRadius;
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

        drawBall(ctx);

        // perform logic here
        updatePaddlePos(paddle_L_pos, paddle_L_vel);
        updatePaddlePos(paddle_R_pos, paddle_R_vel);
        drawPaddles(ctx);
    }

    function drawPaddles(ctx) {
        Graphics.draw.line(ctx,
            paddle_L_pos[0], paddle_L_pos[1],
            PAD_WIDTH, util.config.pong.rPadColor
        );

        Graphics.draw.line(ctx,
            paddle_R_pos[0], paddle_R_pos[1],
            PAD_WIDTH, util.config.pong.lPadColor
        );
    }

    function drawBall(ctx){
        if (!isFullRadius){
            drawBall.increment = ++drawBall.increment || 0;
            Graphics.draw.circle(ctx, ball_pos, drawBall.increment);
            if(drawBall.increment == ballRadius) isFullRadius = true;
        } else {
            Graphics.draw.circle(ctx, ball_pos, ballRadius);
            drawBall.increment = 0; // cleanup!
        }
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

