/**
 * Canvas Module
 * Singleton design pattern will handle
 * One instance of the Canvas Object
 * Created by jono on 15-04-25.
 */
var Canvas = (function(){
    var mCanvas = null;
    var mWidth = 0;
    var mHeight = 0;
    var mCtx = null; // the canvas context
    var mBegin = false;
    var mCallback = null;
    this.constructor = null;
    var animationDidStop = function() {
        return 'did finish all animations!';
    }

    /**
     * verify inits was called
     */
    function throwIlligalStateException() {
        if (!mCanvas){
            throw "Canvas - Illegal state exception - did you call init?";
        }
    }


    return {
        /**
         * inits share instance
         * @param canvas
         * @param width
         * @param height
         */
        init: function(canvas, width, height) {
            if (arguments.length != 3){
                throw "Canvas - must initialize canvas";
            }

            // ensure there is only one instance of canvas!
            if (!mCanvas) {
                mCanvas = canvas;
                mWidth = width;
                mHeight = height;
                mBegin = true;
            }

            return this;
        },

        /**
         * gives focus to the canvas to listen for registered events
         */
        focus:function() {
            throwIlligalStateException();
            mCanvas.focus();
        },

        /**
         * Sets main frame color
         * @param color
         */
        setBackgroundColor: function(color) {
            throwIlligalStateException();
            if (arguments.length && color && color.length){
                mCanvas.style.backgroundColor = color;
            }
        },

        /**
         * canvas width
         * @returns {number}
         */
        getWidth: function() {
            throwIlligalStateException();
            return mWidth;
        },

        /**
         * canvas height
         * @returns {number}
         */
        getHeight: function() {
            throwIlligalStateException();
            return mHeight;
        },

        /**
         * 2D Ctx
         * @returns {2d Ctx}
         */
        get2DCtx: function(){
            throwIlligalStateException();

            if (!mCtx){
                mCtx = mCanvas.getContext('2d');
            }

            return mCtx;
        },

        /**
         * if the context hasn't already been initialized
         * returns handle to 3D Context
         * @returns {webgl}
         */
        get3DCtx: function() {
            throwIlligalStateException();

            if (!mCtx) {
                mCtx = mCanvas.getContext('webgl');
            }

            return mCtx;
        },

        /**
         * draw handler * frames per second
         * will pass the current context back to draw handler for further end user processing
         * @param userFunction
         */
        setDrawHandler: function(userFunction) {
            throwIlligalStateException();
            if (typeof userFunction !== 'function'){
                throw "must be function for callback";
            }

            // otherwise
            mCallback = userFunction;
        },

        registerKeyDownListener: function(onKeyDown){
            throwIlligalStateException();
            if (typeof onKeyDown !== 'function'){
                throw 'must be function for callback';
            }

            // otherwise
            mCanvas.addEventListener('keydown',onKeyDown,false);
        },

        registerKeyUpListener: function(onKeyUp){
            throwIlligalStateException();
            if (typeof onKeyUp !== 'function'){
                throw 'must be function for callback';
            }

            // otherwise
            mCanvas.addEventListener('keyup', onKeyUp, false);
        },

        getKeyMap: function() {
            return {
                87:'W',
                83:'S',
                65:'A',
                68:'D',
                37:'LEFT',
                38:'UP',
                39:'RIGHT',
                40:'DOWN'
            };
        },

        /**
         * Important:
         * This method must be called for several purposes:
         * 1. initializes main drawing loop utilizing window.requestAnimationFrame
         * 2. clears the 2D context once per frame refresh
         * 3. updates api user via callback which passes back the current context which can be use for further drawing processing!
         */
        start: function() {
            throwIlligalStateException();

            if (mBegin) {
                this.get2DCtx().clearRect(
                    0, 0,
                    this.getWidth(), this.getHeight()
                );
                requestAnimationFrame(this.start.bind(Canvas));
                mCallback(this.get2DCtx());
            } else {
                console.log(animationDidStop());
            }
        },

        /**
         * not mandatory but can be call for cleanup purposes
         */
        finish: function() {
            mBegin = false;
            console.log('attempting to stop animations...');
            return true;
        }
    }
})();