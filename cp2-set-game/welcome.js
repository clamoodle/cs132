/**
 * @author Pearl Chen
 * Welcome page event handlers!
 */

(function () {
    "use strict";
    const WELCOME_SONG = qs("#welcome-song");

    function init() {
        qs("#music-button").addEventListener("click", startGameWithMusic);
        qs("#mute-button").addEventListener("click", startGame);
        qs("#sound-button").addEventListener("click", toggleSound);
        qs("#login-button").addEventListener("click", showLogin);
    }

    function startGame() {
        // Hides sound menu
        qs("#sound-menu").classList.add("hidden");
        // Show title menu
        qs("#welcome-view").classList.remove("hidden");
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
    }

    init();
})();
