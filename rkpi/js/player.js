var audio = new Audio();
audio.setAttribute("type", "audio/mpeg");
var currentPlayer = null;
var duration = "0:00";
var fadeSpeed = 500;
var hideTimeout = 3000;
var lastTimeout = null;
var isPaused = null;
var stopComplete = null;

audio.onended = function () {
    stopPlayer(currentPlayer);
};

audio.ontimeupdate = function () {
    if (currentPlayer !== null) {
        updateCurrentTimeBar();
    }
};

audio.ondurationchange = function () {
    duration = formatTime(audio.duration);
};

audio.onprogress = function () {
    if (audio.duration > 0) {
        $(currentPlayer).find(".player-bar-buffer")
                .width((audio.buffered.end(audio.buffered.length - 1) * 100 / audio.duration).toFixed(2) + '%');
    }
};

audio.onplay = function () {
    if (stream) {
        if (!stream.paused) {
            radioClick(false);
        }
    }
};

//
// Init (click on stoped player)
//

function playerSmall(player, src) {

    if (currentPlayer === player) {
        return;
    }
    else {
        stopPlayer(currentPlayer);
        currentPlayer = player;

        $(player).find(".player-bar").stop().fadeIn(fadeSpeed);
        $(player).find(".player-bar-current").width(0);

        audio.setAttribute("src", src);
        audio.load();
        playerPause();
    }

}

function playerLarge(player, src, preload, afterStop) {

    if (currentPlayer === player) {
        return;
    }
    else {
        if (preload) {
            preload(player);
            preload = null;
        }

        stopPlayer(currentPlayer);
        currentPlayer = player;

        audio.setAttribute("src", src);
        audio.load();

        $(player).find(".player-btn-text").stop().animate({
            "width": "0"
        }, fadeSpeed, function () {
            $(player).removeClass("player-large-hidden");
            $(player).find(".player-btn-text").hide();
            $(player).find(".player-bar").hide().css({
                "background-color": "#fff"
            }).stop().fadeIn(fadeSpeed);

            $(player).find(".player-bar-current").show();
            $(player).find(".player-bar-buffer").show();
            $(player).find(".player-bar-text").show();
            playerPause();
        });

        if (afterStop) {
            stopComplete = afterStop;
        }

    }
}

//
// Stop animations
//

function stopPlayer(player) {
    if (player) {

        $(player).find(".ricon").removeClass("ricon-pause").addClass("ricon-play");
        audio.pause();
        audio.setAttribute("src", "");
        audio.load();
        currentPlayer = null;


        if ($(player).hasClass("player-small")) {
            playerSmallFade(player, false);
        }
        else {
            stopPlayerLarge(player);
        }

        if (stopComplete) {
            stopComplete(player);
            stopComplete = null;
        }
    }
}

function stopPlayerLarge(player) {
    if (player) {
        $(player).find(".player-bar").stop().fadeOut(fadeSpeed, function () {
            $(player).find(".player-bar-current").width(0).hide();
            $(player).find(".player-bar-buffer").width(0).hide();
            $(player).find(".player-bar-text").hide();

            $(player).find(".player-bar").css({
                "background-color": "#f0f0f0"
            });

            $(player).addClass("player-large-hidden");

            $(player).find(".player-bar").stop().fadeIn(fadeSpeed, function () {
                $(player).find(".player-btn-text").show();
                $(player).find(".player-btn-text").stop().animate({
                    "width": "120"
                });
            });
        });
    }
}

//
// Small player pause animations (mouse)
//

function playerSmallFade(player, fadeIn) {

    if ($(player).hasClass("player-small")) {
        if (fadeIn) {
            $(player).find(".player-bar-current").stop().hide().fadeIn(fadeSpeed);
            $(player).find(".player-bar-buffer").stop().hide().fadeIn(fadeSpeed);
        }
        else {
            $(player).find(".player-bar-current").stop().show().fadeOut(fadeSpeed);
            $(player).find(".player-bar-buffer").stop().show().fadeOut(fadeSpeed);
        }
    }
}

function playerSmallMouseFade(fadeIn) {
    if (isPaused) {
        playerSmallFade(currentPlayer, fadeIn);
    }
}

//
// Pause click
//

function playerPause() {
    if (audio.paused) {
        $(currentPlayer).find(".ricon").addClass("ricon-pause").removeClass("ricon-play");
        playerSmallFade(currentPlayer, true);
        isPaused = false;
        audio.play();
    }
    else {
        $(currentPlayer).find(".ricon").removeClass("ricon-pause").addClass("ricon-play");
        audio.pause();
        isPaused = true;
        clearTimeout(lastTimeout);
        var player = currentPlayer;
        lastTimeout = setTimeout(function () {
            if (player === currentPlayer) {
                playerSmallFade(player, false);
            }
        }, hideTimeout);
    }
}

//
// Seekbar click
//

function playerSeekBar(e, bar) {
    if (currentPlayer) {
        var x = e.pageX - $(bar).offset().left;
        audio.currentTime = audio.duration * (x / $(bar).width());
    }

}

//
// CurrentTime update
//

function updateCurrentTimeBar() {

    var currentTime = audio.currentTime;

    if (audio.duration > 0) {
        $(currentPlayer).find(".player-bar-current")
                .width((currentTime * 100 / audio.duration).toFixed(2) + '%');
    }

    if ($(currentPlayer).find(".player-song-time")) {
        $(currentPlayer).find(".player-song-time").text(formatTime(currentTime) + " / " + duration);
    }
}

//
// Format time
//

function formatTime(seconds) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    seconds = Math.floor(seconds - (hours * 3600) - (minutes * 60));
    var time = "";

    if (hours > 0) {
        time = hours + ":";
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    return time + minutes + ":" + seconds;
}