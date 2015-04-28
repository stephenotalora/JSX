/**
 * Created by jono on 15-04-23.
 */
// TODO: REFACTOR TO USE SINGLETON / MODULE PATTERN
var Graphics = (function(){
    var mCanvas = null;
    var mCanvasWidth = 0;
    var mCanvasHeight = 0;
    var mUtil = GameUtil;

    function getCanvas() {
        if (!mCanvas) {
            throw "must create canvas before attempting to get canvas context";
        }

        var canvasAPI = Canvas.init(
            mCanvas,
            mCanvasWidth, mCanvasHeight
        );

        return canvasAPI;
    }

    return {
        /**
         * creates main frame for games
         * @param name
         * @param width
         * @param height
         */
        createCanvas: function (name, size) {
            if (arguments.length != 2 || !size || !Array.isArray(size)) {
                throw "Graphics - unable to create frame";
            }

            // otherwise
            var target = document.getElementById(mUtil.config.target);
            if (target) {
                if (name && name.length) {
                    document.title = name;
                }

                // check if canvas already exists
                canvas = document.getElementById(mUtil.config.simpleGui.mainFrame);
                if (!canvas) {
                    setSizeValue(size[0], size[1]);
                    mCanvas = document.createElement('canvas');
                    mCanvas.id = mUtil.config.simpleGui.mainFrame;
                    mCanvas.width = mCanvasWidth;
                    mCanvas.height = mCanvasHeight;
                    mCanvas.setAttribute('tabindex','0');
                    target.appendChild(mCanvas);
                }
            }

            function setSizeValue(width, height) {
                var MIN_WIDTH = 100, MIN_HEIGHT = 100;
                if (width >= MIN_WIDTH && height >= MIN_HEIGHT) {
                    mCanvasWidth = width;
                    mCanvasHeight = height;
                } else {
                    throw "Graphics - Invalid width and height for canvas, must must be greater than 100px for width and height";
                }
            }

            return getCanvas();
        },

        loadImage: function (uri) {
            if (!uri || typeof uri !== 'string' || !uri.length) {
                throw 'Graphics - Invalid arugment exception';
            }
            var image = new Image();
            image.src = uri;
            return image;
        },

        draw: {
            /**
             *
             * @param context       - required
             * @param centerPoint   - required
             * @param radius        - required
             * @param lineWidth     - defaults to 1px if non provided
             * @param lineColor     - defaults to white if non provided
             * @param fillColor     - no fill if non provided
             */
            circle: function (context, centerPoint, radius, lineWidth, lineColor, fillColor) {
                if(arguments.length != 3) {
                    throw 'Graphics - draw circle requires context, center point and radius';
                } else if(!context || !centerPoint || !Array.isArray(centerPoint) || !typeof radius === 'number' || radius < 0){
                    throw 'Graphics - invalid argument exception';
                }

                context.beginPath();
                context.arc(centerPoint[0], centerPoint[1], radius, 0, 2 * Math.PI, false);
                if (typeof fillColor === 'string' && fillColor !== undefined && fillColor.length) {
                    context.fillStyle = fillColor;
                    context.fill();
                }
                context.lineWidth = (typeof lineWidth === 'number' && lineWidth > 0) ? lineWidth : 1;
                context.strokeStyle = (typeof lineColor === 'string' && lineColor != undefined && lineColor.length) ? lineColor : 'white';
                context.stroke();
            },

            /**
             *
             * @param context       - required
             * @param pointA        - required
             * @param pointB        - required
             * @param lineWidth     - optional, defaults to 1px.
             * @param color         - optional, defaules to white.
             * @throws exception if not enough arguments provides
             * @throws Illegal argument exception
             */
            line: function (context, pointA, pointB, lineWidth, color) {
                if (arguments.length < 3){
                    throw 'Graphics - draw line requires context, and points to begin and end line';
                } else if (!context || !pointA || !Array.isArray(pointA) || !pointB || !Array.isArray(pointA)){
                    throw 'Graphics - Illegal argument exception';
                }

                // otherwise
                context.beginPath();
                context.moveTo(pointA[0], pointA[1]);
                context.lineTo(pointB[0], pointB[1]);
                context.lineWidth = (typeof lineWidth === "number" && lineWidth > 0) ? lineWidth : 1;
                context.strokeStyle = (typeof color === 'string' && color.length) ? color : 'white';
                context.stroke();

            },

            /**
             * Simple drawing img implementation
             * TODO: PRELOAD FROM NETWORK HIT
             * @param context
             * @param image
             * @param position
             * @param size
             */
            image: function (context, image, position, size) {
                if (!context || !image || !position
                    || !Array.isArray(position) || !size || !Array.isArray(size)) {
                    throw 'Graphics - Illegal Argument Exception';
                }

                // otherwise
                context.drawImage(
                    image,
                    position[0], position[1],
                    size[0], size[1]
                );
            }
        }
    }
})();