/**
 * Created by jotalora on 15-05-09.
 * wrapper Object to generate random numbers
 */
var Random = {
    /**
     * generates a number between 0 (inclusive) and 1(exclusive)
     */
    number: function() { return Math.random(); },

    /**
     * Generates a random number given the rage
     * @param from - inclusive
     * @param to - inclusive
     * @returns number
     */
    floatRange: function(from, to) {
        if (!to) { return 0; }

        // otherwise ...
        return this.number() * (to - from) + from;
    },

    /**
     * @param from
     * @param to
     * @return number
     */
    range: function(from, to) { return Math.round(this.floatRange(from, to)); },

    /**
     * @param from
     * @param to
     * @return number
     */
    rangeDown: function(from, to) { return Math.floor(this.floatRange(from, to)); }
};