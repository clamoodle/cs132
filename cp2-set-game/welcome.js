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
        // For gap-less seamless looping
        WELCOME_SONG.addEventListener('timeupdate', function(){
            var buffer = .36
            if(this.currentTime > this.duration - buffer){
                this.currentTime = 0
                this.play()
            }
        });
    }

    // /**
    //  * For gap-less seamless looping between each loop of a song, shifts the next play-back forward
    //  * @param {float} gapTime - time in gap to be made up
    //  */
    // function shiftMusic(gapTime) {
    //     var buffer = gapTime;
    //     if(this.currentTime > this.duration - buffer){
    //         this.currentTime = 0
    //         this.play()
    //     }
    // }

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
