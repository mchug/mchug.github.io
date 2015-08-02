function beforeLoad(player) {
    var parent = $(player).parent().parent();
    setTimeout(function () {
        $(parent).find(".read-whole").css({"width": "100%"});
    }, fadeSpeed * 1.1);
    $(parent).find(".comments-image").stop().fadeOut(fadeSpeed);
    $(parent).find(".comments-text").stop().fadeOut(fadeSpeed);
    $(parent).find(".data").stop().fadeOut(fadeSpeed);
}

function afterStop(player) {
    var parent = $(player).parent().parent();
    setTimeout(function () {
        $(parent).find(".read-whole").css({"width": "180px"});
    }, fadeSpeed * 0.9);
    $(parent).find(".comments-image").stop().delay(fadeSpeed).fadeIn(fadeSpeed);
    $(parent).find(".comments-text").stop().delay(fadeSpeed).fadeIn(fadeSpeed);
    $(parent).find(".data").stop().delay(fadeSpeed).fadeIn(fadeSpeed);
}