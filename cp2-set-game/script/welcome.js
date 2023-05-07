/**
 * @author Pearl Chen
 * Welcome page event handlers/animations!
 */

(function () {
    "use strict";
    const WELCOME_SONG = qs("#welcome-song");
    const WELCOME_SONG_TIME_SHIFT = 0.34; // The amount of time at the end of the audio track to be overlapped

    function init() {
        qs("#music-button").addEventListener("click", showWelcomeWithMusic);
        qs("#mute-button").addEventListener("click", showWelcome);
        qs("#music-toggle").addEventListener("click", toggleMusic);
        qs("#login-button").addEventListener("click", showLogin);
        qs("#create-button").addEventListener("click", showCreateChar);
        // For gap-less seamless looping of songs
        WELCOME_SONG.addEventListener(
            "timeupdate",
            shiftMusic,
            WELCOME_SONG_TIME_SHIFT
        );
    }

    /**
     * For gap-less seamless looping between each loop of a song, shifts the next play-back forward
     * @param gapTime time in gap in seconds to be made up
     */
    function shiftMusic() {
        if (this.currentTime > this.duration - this.gapTime) {
            this.currentTime = 0;
            this.play();
        }
    }

    function showWelcome() {
        hideView("#sound-menu");
        showView("#welcome-view");
    }

    function showWelcomeWithMusic() {
        // Default music is muted upon page first loading
        toggleMusic();
        showWelcome();
    }

    function toggleMusic() {
        let musicToggle = qs("#music-toggle");
        if (musicToggle.classList.contains("muted")) {
            // Plays song and changes button src to "on"
            musicToggle.classList.remove("muted");
            musicToggle.src = "media/music-on-button.png";
            WELCOME_SONG.play();
        } else {
            // Pauses song and changes button src to "off"
            musicToggle.classList.add("muted");
            musicToggle.src = "media/music-off-button.png";
            WELCOME_SONG.pause();
        }
    }

    function showLogin() {
        showView("#login-window");
        window.scrollBy(0, 1);
    }

    function showCreateChar() {
        hideAll("section");  // clears all page views in index.html
        showView("#char-creation-view");
    }

    init();
})();
