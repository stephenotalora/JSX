/**
 * Created by jotalora - A00894017 on 15-05-10.
 */
function Audio(id) {
    this.id = id;
}

Audio.prototype.preload = function(url) {
    this.audio = document.getElementById(this.id);
    if (!this.audio) {
        this.audio = document.createElement('audio');
        this.audio.id = this.id;
        if (url && url.length) {
            this.audio.setAttribute('src', url);
            this.audio.setAttribute('preload', 'auto');
        } else {
            throw 'Audio - invalid argument exception';
        }

        document.body.appendChild(this.audio);
    }
}








