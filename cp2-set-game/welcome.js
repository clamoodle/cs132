/**
 * @author Pearl Chen
 * Welcome page event handlers!
 */

(function () {
    "use strict";
    const WELCOME_SONG = qs("#welcome-song");
    const WELCOME_SONG_TIME_SHIFT = 0.34; // The amount of time at the end of the audio track to be overlapped

    function init() {
        qs("#music-button").addEventListener("click", startGameWithMusic);
        qs("#mute-button").addEventListener("click", startGame);
        qs("#sound-button").addEventListener("click", toggleSound);
        qs("#login-button").addEventListener("click", showLogin);
        qs("#create-button").addEventListener(
            "click",
            (open = () => {
                window.location.href = "create-char.html";
            })
        );
        // For gap-less seamless looping
        WELCOME_SONG.addEventListener("timeupdate", shiftMusic);
    }

    /**
     * For gap-less seamless looping between each loop of a song, shifts the next play-back forward
     */
    function shiftMusic() {
        console.log(this.currentTime);
        gapTime = evt.currentTar; // Time in gap to be made up
        if (this.currentTime > this.duration - WELCOME_SONG_TIME_SHIFT) {
            this.currentTime = 0;
            this.play();
        }
    }

    function startGame() {
        // Hides sound menu
        qs("#sound-menu").classList.add("hidden");
        // Show title menu
        qs("#welcome-view").classList.remove("hidden");
        // Resets background track
        WELCOME_SONG.currentTime = 0;
    }

    function startGameWithMusic() {
        startGame();
        WELCOME_SONG.play();
    }

    function toggleSound() {
        if (WELCOME_SONG.paused) {
            WELCOME_SONG.play();
        } else {
            WELCOME_SONG.pause();
        }
    }

    function showLogin() {
        qs("#login-view").classList.remove("hidden");
        window.scrollBy(0,1);
    }

    init();
})();
