/**
 * Created by jono on 15-04-23.
 */
// TODO: REFACTOR TO USE SINGLETON / MODULE PATTERN
var Graphics = {
    canvas: null,
    canvasWidth: 0,
    canvasHeight: 0,
    util: GameUtil,

    /**
     * just to provide some structure
     * @returns {null}
     */
    getCanvas: function () {
        if (!this.canvas) {
            throw "must create canvas before attempting to get canvas context";
        }

        var CanvasAPI = Canvas.init(
            this.canvas,
            this.canvasWidth, this.canvasHeight
        );

        return CanvasAPI;
    },

    /**
     * creates main frame for games
     * @param name
     * @param width
     * @param height
     */
    createCanvas: function (name, width, height) {
        if (arguments.length != 3) {
            throw "Graphics - unable to create frame";
        }

        // otherwise
        var target = document.getElementById(this.util.config.target);
        if (target) {
            if (name && name.length) {
                document.title = name;
            }

            // check if canvas already exists
            this.canvas = document.getElementById(this.util.config.simpleGui.mainFrame);
            if (!this.canvas) {
                setSizeValue(this, width, height);
                this.canvas = document.createElement('canvas');
                this.canvas.id = this.util.config.simpleGui.mainFrame;
                this.canvas.width = this.canvasWidth;
                this.canvas.height = this.canvasHeight;
                target.appendChild(this.canvas);
            }
        }

        function setSizeValue(self, width, height) {
            var MIN_WIDTH = 100, MIN_HEIGHT = 100;
            if (width >= MIN_WIDTH && height >= MIN_HEIGHT) {
                self.canvasWidth = width;
                self.canvasHeight = height;
            } else {
                throw "Graphics - Invalid width and height for canvas, must must be greater than 100px for width and height";
            }
        }

        return Graphics.getCanvas();
    },

    loadImage:function(uri){
        if(!uri || typeof uri !== 'string' || !uri.length){ throw 'Graphics - Invalid arugment exception' ;}
        var image = new Image();
        image.src = uri;
        return image;
    },

    draw: {
        circle: function(context, centerPoint, radius, lineWidth, lineColor, fillColor) {
            if (arguments.length < 4) throw 'Graphics - insufficient args, must pass context, point, radius, line width';
            else if (!context) throw 'Grapchis - context is null, perhaps initialize context?';
            else if (!Array.isArray(centerPoint)) throw 'Graphics - center point must be a two elm array for x and y pos';
            else if (typeof lineWidth !== 'number' || lineWidth <= 0) {
                throw 'Graphics - invalid argument exception';
            }
            context.beginPath();
            context.arc(centerPoint[0], centerPoint[1],radius,0,2*Math.PI,false);
            if (fillColor !== undefined) {
                context.fillStyle = fillColor;
                context.fill();
            }
            context.lineWidth = lineWidth;
            context.strokeStyle = lineColor === undefined ? 'white' : lineColor;
            context.stroke();
        },

        line: function(context, pointA, pointB, lineWidth, color){

        },

        /**
         * Simple drawing img implementation
         * TODO: PRELOAD FROM NETWORK HIT
         * @param context
         * @param image
         * @param position
         * @param size
         */
        image: function(context, image, position, size){
            if (!context || !image || !position
                || !Array.isArray(position) || !size || !Array.isArray(size)) { throw 'Graphics - Illegal Argument Exception'; }

            // otherwise
            context.drawImage(
                image,
                position[0],position[1],
                size[0], size[1]
            );
        }
    }
};