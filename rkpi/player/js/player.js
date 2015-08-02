var stream = new Audio();
stream.setAttribute("type", "audio/mpeg");
stream.setAttribute("src", "http://77.47.130.190:8000/radiokpi");
stream.load();

function radioClick(stopAudio) {

    if (stream.paused) {
        $("#radioIcon").removeClass("ricon-play").addClass("ricon-pause");
        stream.load();
        stream.play();
    }
    else {
        $("#radioIcon").removeClass("ricon-pause").addClass("ricon-play");
        stream.pause();
    }
}

function getSongTitle() {
    $.get("/player/php/getSong.php", function (msg) {
        $("#songTitle").text(msg);
    });
}

getSongTitle();

setInterval(getSongTitle, 3000);


function copyToClipboard() {
    window.prompt("Скопируйте в буфер: Ctrl+C, Enter", $("#songTitle").text());
}

var scrollInterval;

window.onload = function () {

    var st = $("#songTitle"); // st = SontTitle
    var pd = st.parent();     // pd = ParentDiv

    st.offset({left: pd.offset().left});

    clearInterval(scrollInterval);
    setTimeout(function () {
        scrollInterval = setInterval(scrollSongTitle, 30);
    }, 4000);
};

function scrollSongTitle() {
    var st = $("#songTitle"); // st = SontTitle
    var pd = st.parent();     // pd = ParentDiv
    var step = 2;

    // if st.text not fully visable
    if (st.width() > pd.width()) {

        // scroll left with defined step
        st.offset({left: st.offset().left - step});

        // how many text we still need to show (in pixels)
        var textToShow = st.offset().left + st.width() - pd.offset().left;

        if (textToShow <= pd.width()) {
            clearInterval(scrollInterval);

            st.delay(4000).fadeOut(1000);

            setTimeout(function () {
                st.offset({left: pd.offset().left});
                st.fadeIn(1000);
                setTimeout(function () {
                    clearInterval(scrollInterval);
                    scrollInterval = setInterval(scrollSongTitle, 30);
                }, 5000);
            }, 5000);
        }

    } else if (st.offset() != pd.offset()) {
        st.offset({left: pd.offset().left});
    }
}