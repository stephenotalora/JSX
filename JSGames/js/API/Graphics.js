/**
 * Created by jono on 15-04-23.
 */

var Graphics  = {
    canvas:null,
    canvasWidth:0,
    canvasHeight:0,
    config: GameConfigs,
    begin: true,

    /**
     * just to provide some structure
     * @returns {null}
     */
    getCanvas: function() {
        if (!this.canvas) {
            throw "must create canvas before attempting to get canvas context";
        }

        // private variables
        var self = this;
        var ctx = null;
        var callback = null;

        var CanvasAPI  = {

            /**
             * Sets main frame color
             * @param color
             */
            setBackgroundColor: function(color) {
                if (self.canvas && arguments.length && color && color.length){
                    this.get2DCtx().fillStyle = color;
                    this.get2DCtx().fillRect(0,0, this.getWidth(), this.getHeight());
                }
            },

            /**
             * canvas width
             * @returns {number}
             */
            getWidth: function() { return self.canvasWidth; },

            /**
             * canvas height
             * @returns {number}
             */
            getHeight: function() {return self.canvasHeight; },

            /**
             * 2D Ctx
             * @returns {2d Ctx}
             */
            get2DCtx: function() {
                if (ctx == null){
                    ctx = self.canvas.getContext("2d");
                }

                return ctx;
            },

            /**
             * 3D Ctx
             * @returns {webgl}
             */
            get3DCtx: function() {
                if (ctx == null) {
                    ctx = self.canvas.getContext("webgl");
                }

                return ctx;
            },

            /**
             * draw handler * frames per second
             * will pass the current context back to draw handler for further end user processing
             * @param userFunction
             */
            setDrawHandler: function(userFunction) {
                if (typeof userFunction !== 'function'){ throw "must be function for callback"; }

                // otherwise
                callback = userFunction;
            },

            start: function() {
                var canvas = this;
                if (self.begin) {
                    requestAnimationFrame(this.start.bind(CanvasAPI));
                    setTimeout(function () {
                        callback(ctx);
                        ctx.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
                        canvas.setBackgroundColor(ctx.fillStyle);
                    }, 1000 / 60);
                }
            },
            finish: function() { self.begin = false; }
        };

        return CanvasAPI;
    },

    /**
     * creates main frame for games
     * @param name
     * @param width
     * @param height
     */
    createCanvas: function(name, width, height) {
        if(arguments.length != 3) { throw "unable to create frame"; }

        // otherwise
        var target = document.getElementById(this.config.target);
        if (target){
            if (name && name.length){ document.title = name; }

            // check if canvas already exists
            this.canvas = document.getElementById(this.config.simpleGui.mainFrame);
            if(!this.canvas){
                setSizeValue(this, width, height);
                this.canvas = document.createElement('canvas');
                this.canvas.id = this.config.simpleGui.mainFrame;
                this.canvas.width = this.canvasWidth;
                this.canvas.height = this.canvasHeight;
                target.appendChild(this.canvas);
            }
        }

        function setSizeValue(self, width, height){
            var MIN_WIDTH = 100, MIN_HEIGHT = 100;
            if (width >= MIN_WIDTH && height >= MIN_HEIGHT){
                self.canvasWidth = width;
                self.canvasHeight = height;
            } else {
                throw "Invalid width and height for canvas, must must be greater than 100px for width and height";
            }
        }

        return Graphics.getCanvas();
    }

    //drawCircle(context) {}
};