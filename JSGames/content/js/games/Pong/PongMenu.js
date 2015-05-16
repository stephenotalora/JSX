/**
 * Created by jotalora on 15-05-15.
 */
(function(){
    var gameContainer = document.getElementById(GameConfigs.pong.targetNode);
    $('#side_nav').animate({height: '600px'});

    if (gameContainer) {
        var colors = ['red', 'white', 'yellow', 'green', 'blue'];
        var id = setInterval(updateBgColor, 300);


        function updateBgColor() {
            var bg = updateBgColor;
            bg.update = ++bg.update || 0;
            if (bg.update < colors.length) {
                gameContainer.style.backgroundColor = colors[bg.update];
            } else {
                clearInterval(id);
            }
        }

        setTimeout(function() {
            gameContainer.style.backgroundColor = 'black';
            var btn = document.createElement('a');
            var info = document.createElement('div');
            btn.innerHTML = "<h4>Click Here to Start the Game!</h4>";
            info.innerHTML = "" +
                "<br class='clear'/>" +
                "<h1>Pong!</h1> <br /> <br />P1 ~ Press key \'w\' or \'s\' to move L paddle up and/or down" +
                "<br />" +
                "P2 ~ Press key UP and/or DOWN  to move R paddle up and/or down" + "<br class='clear'/>";

            gameContainer.appendChild(info);
            gameContainer.appendChild(btn);

            // attach handlers
            btn.addEventListener('click', function() {
                Pong.init();
                btn.style.display = 'none';
                info.style.display = 'none';
                // grab menu bar to display current player score
                var menu = document.getElementById('side_nav');
                //menu.style.height = '150px';
                $(menu).animate({height: '150px'});
                menu.innerHTML = '';
                var score = document.createElement('div');
                menu.appendChild(score);
                var restart = document.createElement('a');
                menu.appendChild(restart); restart.innerHTML = "<br /><br />Restart!";
                restart.addEventListener('click', function() {
                    location.reload();
                }, false);
                Pong.setUpdateListener(function(lscore, rscore) {
                    score.innerHTML = "P1 - Score = " + lscore + "<br />P2 - Score = " + rscore;
                });
            }, false);
        }, 1900);
    }
})();

