/**
 * Created by jonathan otalora - A00894017 on 15-04-23.
 * Though there could be many canvas - limit to one graphics and canvas api
 * TODO: should refactor for many instances of canvas and graphics api????
 */
var GraphicsManager = (function(){
    var mCanvas = null;
    var mCanvasWidth = 0;
    var mCanvasHeight = 0;

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
         * @param size - array in terms of width and height
         */
        createCanvas: function (name, parentNodeId, id, size) {
            if (arguments.length < 3) {
                throw "GraphicsManager - unable to create frame";
            } else if (arguments.length == 4 && (!size || !Array.isArray(size))) {
                throw "GraphicsManager - invalid argument exception";
            }


            var target = null;
            if (typeof parentNodeId !== 'string') {
                throw 'cannot attach canvas to target';
            } else {
                target = document.getElementById(parentNodeId);
                if (!target) {
                    throw 'undefined target ~ cannot append canvas to target';
                }
            }

            // otherwise
            if (target) {
                if (name && name.length) {
                    document.title = name;
                }

                // check if canvas already exists
                mCanvas = document.getElementById(id);
                if (!mCanvas) {
                    setSizeValue(size[0], size[1]);
                    mCanvas = document.createElement('canvas');
                    mCanvas.id = id;
                    mCanvas.width = mCanvasWidth;
                    mCanvas.height = mCanvasHeight;
                    mCanvas.setAttribute('tabindex','0');
                    target.appendChild(mCanvas);
                } else { // canvas embedded in html
                    //TODO: needs testing...
                    setSizeValue(mCanvas.width, mCanvas.height);
                }
            }

            function setSizeValue(width, height) {
                var MIN_WIDTH = 100, MIN_HEIGHT = 100;
                if (width >= MIN_WIDTH && height >= MIN_HEIGHT) {
                    mCanvasWidth = width;
                    mCanvasHeight = height;
                } else {
                    throw "GraphicsManager - Invalid width and height for canvas, must must be greater than 100px for width and height";
                }
            }

            return getCanvas();
        },

        /**
         * loads / caches images
         * @param uri
         * @returns {*}
         */
        loadImage: function (uri) {
            if (!uri || typeof uri !== 'string' || !uri.length) {
                throw 'GraphicsManager - Invalid arugment exception';
            }
            var image = new Image();
            image.src = uri;
            return image;
        },

        /**
         * GraphicsManager.draw - build-in object to handle drawing in the canvas
         */
        draw: {
            font: function(context, str, pos, width, font, size, fill, color) {
                if (!context){ throw 'GraphicsManager - draw font requires context and position'; }
                else if (!str || !str.length || !pos || !Array.isArray(pos)) { throw 'GraphicsManager - Illegal argument exception'; }

                // otherwise
                context.font = size + "px " + (!font || !font.length ? 'serif' : font);
                if (fill) {
                    context.fillText(str, pos[0], pos[1]);
                    context.fillStyle = (!color ? 'white' : color[0]);
                }
                else {
                    context.strokeText(str, pos[0], pos[1]);
                    context.strokeStyle = (!color ? 'white' : color[1]);
                }
            },

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
                if(arguments.length < 3) {
                    throw 'GraphicsManager - draw circle requires context, center point and radius';
                } else if(!context || !centerPoint || !Array.isArray(centerPoint) || !typeof radius === 'number' || radius < 0){
                    throw 'GraphicsManager - invalid argument exception';
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
                    throw 'GraphicsManager - draw line requires context, and points to begin and end line';
                } else if (!context || !pointA || !Array.isArray(pointA) || !pointB || !Array.isArray(pointA)){
                    throw 'GraphicsManager - Illegal argument exception';
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
             * TODO: PRE-LOAD FROM NETWORK HIT?
             * @param context
             * @param image
             * @param position
             * @param size
             */
            image: function (context, image, position, size) {
                if (!context || !image || !position
                    || !Array.isArray(position) || !size || !Array.isArray(size)) {
                    throw 'GraphicsManager - Illegal Argument Exception';
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