/**
 * @author Pearl Chen
 * Set game event handlers!
 */

(function () {
    "use strict";

    function init() {
        qs("#start-btn").addEventListener("click", toggleView);
        qs("#back-btn").addEventListener("click", toggleView);
    }

    // Toggle between game and menu view
    function toggleView() {
        qs("#game-view").classList.toggle("hidden");
        qs("#menu-view").classList.toggle("hidden");
    }

    init();
})();
