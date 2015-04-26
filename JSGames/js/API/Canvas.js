/**
 * Created by jono on 15-04-25.
 */
var Canvas  = {
    canvas: null,
    width:0,
    height:0,
    callback: null,
    ctx: null,
    begin: false,


    /**
     * inits canvas object
     * @param canvas
     * @param width
     * @param height
     */
    init: function(canvas, width, height) {
        if (arguments.length != 3 || canvas == null){
            throw "Canvas - must initialize canvas";
        }

        // otherwise
        this.width = width;
        this.height = height;
        this.canvas = canvas;
        this.begin = true;

        return this;
    },

    /**
     * Sets main frame color
     * @param color
     */
    setBackgroundColor: function(color) {
        if (this.canvas && arguments.length && color && color.length){
            this.canvas.style.backgroundColor = color;
        }
    },

    /**
     * canvas width
     * @returns {number}
     */
    getWidth: function() { return this.width; },

    /**
     * canvas height
     * @returns {number}
     */
    getHeight: function() {return this.height; },

    /**
     * 2D Ctx
     * @returns {2d Ctx}
     */
    get2DCtx: function() {
        if (this.ctx == null){
            this.ctx = this.canvas.getContext("2d");
        }

        return this.ctx;
    },

    /**
     * 3D Ctx
     * @returns {webgl}
     */
    get3DCtx: function() {
        if (this.ctx == null) {
            this.ctx = this.canvas.getContext("webgl");
        }

        return this.ctx;
    },

    /**
     * draw handler * frames per second
     * will pass the current context back to draw handler for further end user processing
     * @param userFunction
     */
    setDrawHandler: function(userFunction) {
        if (typeof userFunction !== 'function'){ throw "must be function for callback"; }

        // otherwise
        this.callback = userFunction;
    },

    start: function() {
        //var self = this;
        if (this.begin) {
            this.get2DCtx().clearRect(
                0, 0,
                this.getWidth(), this.getHeight()
            );
            requestAnimationFrame(this.start.bind(Canvas));
            this.callback(this.get2DCtx());
        }
    },

    finish: function() { this.begin = false; }
};