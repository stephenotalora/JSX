/**
 * Created by jonathanotalora - A00894017 on 15-04-18.
 */
var GameUtil = {
    config: GameConfigs,
    isDebugMode: function() {
        if (this.config != undefined && this.config.debug){ return true; }
        return false;
    },

    /**
     * Logs into console
     * Convinience logging Method for debugging purposes
     * @param msg
     */
    log: function(msg) {
        if (this.isDebugMode()){
            console.log(msg);
        }
    },

    /**
     * Alerts into the current window
     * Convinience Method for debugging purposes
     * @param msg
     */
    alert: function(msg){
        if (this.isDebugMode()){
            alert(msg);
        }
    }
};
