/**
 * Created by jotalora on 15-05-15.
 */
(function(){
    var gameContainer = document.getElementById(GameConfigs.pong.targetNode);
    if (gameContainer) {
        var btn = document.createElement('div');
        btn.innerHTML = "<h3>Click Here to Start the Game!</h3>";
        gameContainer.appendChild(btn);
        btn.addEventListener('click', function() {
            Pong.init();
            btn.style.display = 'none';
        }, false);
    }
})();

