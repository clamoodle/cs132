/**
 * @author Pearl Chen
 * Welcome page event handlers/animations, also handles the sound toggle/menu button in header
 */

(function () {
    "use strict";
    const MUSIC = qs("#music");
    const MUSIC_TIME_SHIFT = 0.34; // The amount of time at the end of the audio track to be overlapped

    function init() {
        qs("#music-button").addEventListener("click", showWelcomeWithMusic);
        qs("#mute-button").addEventListener("click", showWelcome);
        qs("#music-toggle").addEventListener("click", toggleMusic);
        qs("#login-button").addEventListener("click", showLogin);
        qs("#create-button").addEventListener("click", showCreateChar);
        // For gap-less seamless looping of songs
        // MUSIC.addEventListener("timeupdate", shiftMusic, MUSIC_TIME_SHIFT);
    }

    function shiftMusic() {
        gapTime = MUSIC_TIME_SHIFT;
        if (this.currentTime > this.duration - gapTime) {
            this.currentTime = 0;
            MUSIC.play();
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
            // Pauses song and changes button background image to "off" with class change
            musicToggle.classList.remove("muted");
            MUSIC.play();
        } else {
            // Plays song and changes button background image to "on" with class change
            musicToggle.classList.add("muted");
            MUSIC.pause();
        }
    }

    function showLogin() {
        showView("#login-window");
        window.scrollBy(0, 1);
    }

    function showCreateChar() {
        hideAll("section"); // clears all page views in index.html
        showView("#char-creation-view");
    }

    init();
})();
