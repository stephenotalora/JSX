/**
 * Created by jono on 15-04-23.
 */

var SimpleGui  = {
    mainFrame:null,
    config: GameConfigs,

    /**
     * just to provide some structure
     * @returns {null}
     */
    getFrame: function() {
        if (!this.mainFrame){ throw "main frame does not exist yet"; }

        // otherwise
        var self = this;
        return {
            /**
             * Sets main frame color
             * @param color
             */
            setBackgroundColor: function(color) {
                if (self.mainFrame && arguments.length && color && color.length){
                    self.mainFrame.style.backgroundColor = color;
                }
            },


            addView: function(object) {
                this.mainFrame.appendChild(object);
            }
        }
    },

    /**
     * creates main frame for games
     * @param name
     * @param width
     * @param height
     */
    createFrame: function(name, width, height) {
        if(arguments.length != 3) { throw "unable to create frame"; }

        // otherwise
        var target = document.getElementById(this.config.target);
        if (target){
            if (name && name.length){ document.title = name; }
            this.mainFrame = document.createElement('div');
            this.mainFrame.id = this.config.simpleGui.mainFrame;
            this.mainFrame.style.width = width + 'px';
            this.mainFrame.style.height = height + 'px';
            this.mainFrame.backgroundColor = 'white';
            this.mainFrame.position = 'middle';
            target.appendChild(this.mainFrame);
        }
    }

};