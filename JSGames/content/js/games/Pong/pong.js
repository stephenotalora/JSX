/**
 * Created by jonathan otalora - A00894017 on 15-04-26.
 */
var Pong = (function(){
    var canvas = null;
    var util = GameUtil;
    var keyMap = null;
    var leftPaddle = null, paddle_L_vel= 0.0, lPadColor = util.config.pong.lPadColor;
    var rightPaddle = null, paddle_R_vel= 0.0, rPadColor = util.config.pong.rPadColor;
    var leftPlayerScore = 0, rightPlayerScore = 0;
    var ball = null, initialBallPos = null, ballVel = 0;

    // symbolic constants
    var PAD_WIDTH = util.config.pong.PAD_WIDTH;
    var PAD_HEIGHT = util.config.pong.PAD_HEIGHT;
    var TABLE_WIDTH = 0, TABLE_HEIGHT = 0, SCALE_FACTOR = 2.0;
    var DIFFICULTY_LEVEL = 0.13; // increment difficulty level by 13% on every paddle strike ~ now this is more like the original game :)
    var LEFT = 1, RIGHT = 0;

    // private methods/closures
    /**
     * simple math to position elements on reserved canvas space / context
     */
    function initGameElms(){
        // table dimensions
        TABLE_WIDTH = canvas.getWidth();
        TABLE_HEIGHT = canvas.getHeight();

        // paddles
        var HALF_PAD_HEIGHT = PAD_HEIGHT / SCALE_FACTOR;
        var HALF_TABLE_HEIGHT = TABLE_HEIGHT / SCALE_FACTOR;

        var yStart = HALF_TABLE_HEIGHT - HALF_PAD_HEIGHT;
        var yEnd   = (HALF_TABLE_HEIGHT + PAD_HEIGHT) - HALF_PAD_HEIGHT;
        var paddle_L_pos = [ // initial left paddle position
            [1.0, yStart], // start at pos x = 1, y = MIDDLE OF TABLE - THE HALF THE PAD OF PADDLE
            [1.0, yEnd] // end at x = 1, y = HALF OF TABLE + THE OTHER HALF OF PAD.
        ];
        leftPaddle = new Paddle( // instantiate left paddle
            paddle_L_pos, paddle_L_vel,
            PAD_WIDTH, lPadColor
        );

        var xPos = TABLE_WIDTH - 1;
        var paddle_R_pos = [[xPos, yStart], [xPos, yEnd]];
        rightPaddle = new Paddle( // instantiate right paddle
            paddle_R_pos, paddle_R_vel,
            PAD_WIDTH, rPadColor
        );

        // init ball
        resetBallPosition();
       // ball = new Ball(initialBallPos, 0, util.config.pong.ballRadius);
        spawnBall(randomDirection());
    }

    function resetBallPosition() {
        initialBallPos = [TABLE_WIDTH/2, TABLE_HEIGHT/2];
    }

    /**
     * draws gutters and middle line on the canvas
     * @param ctx
     */
    function initPongTable(ctx) {
        // draw middle of table:
        GraphicsManager.draw.line(ctx,
            [TABLE_WIDTH/2,0],
            [TABLE_WIDTH/2, TABLE_HEIGHT],
            SCALE_FACTOR
        );

        // draw gutters:
        GraphicsManager.draw.line( // left gutter
            ctx,
            [PAD_WIDTH, 0],
            [PAD_WIDTH, TABLE_HEIGHT],
            SCALE_FACTOR
        );

        GraphicsManager.draw.line( // right gutter
            ctx,
            [TABLE_WIDTH - PAD_WIDTH, 0],
            [TABLE_WIDTH - PAD_WIDTH, TABLE_HEIGHT],
            SCALE_FACTOR
        );
    }

    /**
     * draw callback - canvas.setDrawHandler
     * @param ctx
     */
    function draw(ctx){
        initPongTable(ctx);
        ball.draw(ctx, true, initBallAnim);

        // perform logic here
        updatePaddlePos(leftPaddle.getPosition(), paddle_L_vel);
        updatePaddlePos(rightPaddle.getPosition(), paddle_R_vel);
        leftPaddle.draw(ctx);
        rightPaddle.draw(ctx);

        var rscore = String(rightPlayerScore);
        GraphicsManager.draw.font(ctx,
            rightPlayerScore < 10 ? 0 + rscore : rscore,
            [TABLE_WIDTH/2 + 20, 50], 50,
            'Consolas', 50, true
        );

        var lscore = String(leftPlayerScore);
        GraphicsManager.draw.font(ctx, leftPlayerScore < 10 ? 0 + lscore : lscore,
            [TABLE_WIDTH/2 - 80, 50], 50,
            'Consolas', 50, true
        );
    }


    function randomDirection() {
        var direction = Random.range(0, 1);
        util.log("current direction: " + direction + ' = ' + (direction ? 'left' : 'right'));
        return direction;
    }

    /**
     * spawns a pong ball in the middle of the 'table' / canvas ...
     * @param direction
     */
    function spawnBall(direction) {
        // setting ranges magic numbers as these seemed to worked well
        var randomHVel = Random.range(120, 240),
            randomVVel = Random.range(6, 180);

        if (direction === 0) { ballVel = [randomHVel/60.0, -randomVVel/60.0]; } // at 60 frames / s
        else ballVel = [-randomHVel/60.0, -randomVVel/60.0];

        resetBallPosition();
        ball = new Ball(
            initialBallPos, ballVel,
            util.config.pong.ballRadius
        );
    }

    /**
     * fires ball animations @ 60 frames ~ second
     */
    function initBallAnim() {
        var ballPos = ball.getPosition();
        var ballVel = ball.getVelocity();

        // update ball position in canvas
        ballPos[0] += ballVel[0];
        ballPos[1] += ballVel[1];

        collisionDetection(ballPos, ballVel);
    }

    function collisionDetection(ballPos, ballVel) {

        var MAX_STEP = 15;

        // collision detection logic based on table width and height
        if (ballPos[1] >= (TABLE_HEIGHT - 1) - ball.getRadius()) { ballVel[1] *= -1; } // bottom wall ~ reflect upward
        else if (ballPos[1] <= ball.getRadius()) { ballVel[1] = -ballVel[1]; } // top wall ~ reflect downward.
        else if (ballPos[0] >= (TABLE_WIDTH - PAD_WIDTH) - ball.getRadius()) { // ball strikes right paddle
            if (ballPos[1] >= rightPaddle.getPosition()[0][1] && ballPos[1] <= rightPaddle.getPosition()[1][1]) {
                ballVel[0] = -(ballVel[0] + DIFFICULTY_LEVEL);
                rightPaddle.setColor('red');
                collisionDetection.rightUpdateStep = 1;
            } else { // UPDATE LEFT PLAYER SCORE
                spawnBall(LEFT);
                ++leftPlayerScore;
            }
        } else {
            if (collisionDetection.rightUpdateStep >= MAX_STEP) {
                rightPaddle.setColor(rPadColor);
                collisionDetection.rightUpdateStep = 0;
            }
        }


        if (ballPos[0] <= PAD_WIDTH + ball.getRadius()) { // ball strikes left paddle
            if (ballPos[1] >= leftPaddle.getPosition()[0][1] && ballPos[1] <= leftPaddle.getPosition()[1][1]) {
                ballVel[0] *= -(1 + DIFFICULTY_LEVEL);
                leftPaddle.setColor('red');
                collisionDetection.leftUpdateStep = 1;
            } else { // UPDATE RIGHT PLAYER SCORE ~ and spawn ball in the opposite direction
                spawnBall(RIGHT);
                ++rightPlayerScore;
            }
        } else {
            if (collisionDetection.leftUpdateStep >= MAX_STEP) {
                leftPaddle.setColor(lPadColor);
                collisionDetection.leftUpdateStep = 0;
            }
        }

        if (collisionDetection.rightUpdateStep && collisionDetection.rightUpdateStep > 0) {
            ++collisionDetection.rightUpdateStep;
        }

        if (collisionDetection.leftUpdateStep && collisionDetection.leftUpdateStep > 0) {
            ++collisionDetection.leftUpdateStep;
        }
    }


    /**
     *
     * @param paddlePos
     * @param paddleVel
     */
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
        if (code) {
            try {
                getControlMapping(true)[code]();
            } catch (e) {
                util.log('unexpected key for pong - ' + e);
            }
        }
    }
    function onKeyUp(e) {
        var code = keyMap[e.keyCode];
        if (code) {
            try {
                getControlMapping(false)[code]();
            } catch (e) {
                util.log('unexpected key for pong - ' + e);
            }
        }
    }

    return {
        init: function () {
            canvas = GraphicsManager.createCanvas(
                "Pong",
                util.config.pong.targetNode,
                util.config.pong.mainFrame,
                [util.config.pong.TABLE_WIDTH, util.config.pong.TABLE_HEIGHT]);

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

