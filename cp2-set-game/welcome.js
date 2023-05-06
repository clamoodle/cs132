/**
 * @author Pearl Chen
 * Welcome page event handlers/animations!
 */

(function () {
    "use strict";
    const WELCOME_SONG = qs("#welcome-song");
    const WELCOME_SONG_TIME_SHIFT = 0.34; // The amount of time at the end of the audio track to be overlapped
    const MUSIC_TOGGLE = qs("#music-toggle");

    function init() {
        qs("#music-button").addEventListener("click", startGameWithMusic);
        qs("#mute-button").addEventListener("click", startGame);
        MUSIC_TOGGLE.addEventListener("click", toggleMusic);
        qs("#login-button").addEventListener("click", showLogin);
        qs("#create-button").addEventListener("click", () => {
            window.location.href = "create-char.html";
        });
        qs("#start-button").addEventListener("click", () => {
            window.location.href = "game.html";
        })
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

    function startGame() {
        // Hides sound menu
        qs("#sound-menu").classList.add("hidden");
        // Show title menu
        qs("#welcome-view").classList.remove("hidden");
        // Resets background track
        WELCOME_SONG.currentTime = 0;
    }

    function startGameWithMusic() {
        // Default is muted upon page first loading
        toggleMusic();
        startGame();
    }

    function toggleMusic() {
        if (WELCOME_SONG.classList.contains("muted")) {
            MUSIC_TOGGLE.classList.remove("muted");
            MUSIC_TOGGLE.style.backgroundImage = url(
                "media/music-on-button.png"
            );
            WELCOME_SONG.play();
        } else {
            MUSIC_TOGGLE.classList.add("muted");
            MUSIC_TOGGLE.style.backgroundImage = url(
                "media/music-off-button.png"
            );
            WELCOME_SONG.pause();
        }
    }

    function showLogin() {
        qs("#login-view").classList.remove("hidden");
        window.scrollBy(0, 1);
    }

    init();
})();
