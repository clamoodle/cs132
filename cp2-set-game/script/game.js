(function () {
    "use strict";
    const JUMP_COOLDOWN_MS = 600; // time in MS, the time in game-styles.css to jump up
    const NUM_OBSTACLES = 10;

    // minimum and maximum time in MS between each obstacle
    const OBSTACLE_MIN_TIME_GAP_MS = 500;
    const OBSTACLE_MAX_TIME_GAP_MS = 3000;

    function init() {
        window.addEventListener("keydown", avatarControl);
        addEventListenerToAll(".start-game-button", "click", openGame);
    }

    function avatarControl(e) {
        let avatar = qs("#avatar");
        switch (e.keyCode) {
            // jumping case
            case 38:
            case 32: // up or space key respectively
                // e.preventDefault();
                jump(avatar);
        }
    }

    // Makes whoever the target is jump up and land down
    function jump(target) {
        if (!target.classList.contains("jump")) {
            target.classList.add("jump");
        }
        setTimeout(() => {
            target.classList.remove("jump");
        }, JUMP_COOLDOWN_MS);
    }

    function generateMap() {
        let sumTimeGapSoFarMS = 0;

        // Generating obstacles sliding across the screen
        for (let i = 0; i < NUM_OBSTACLES; i++) {
            let randomTimeGapMS =
                Math.floor(
                    Math.random() *
                        (OBSTACLE_MAX_TIME_GAP_MS - OBSTACLE_MIN_TIME_GAP_MS)
                ) + OBSTACLE_MIN_TIME_GAP_MS;
            setTimeout(() => {
                const newObstacle = document.createElement("div");
                newObstacle.classList.add("obstacle", "sliding-layer");
                qs("#dino-game").appendChild(newObstacle);
            }, randomTimeGapMS + sumTimeGapSoFarMS);
            sumTimeGapSoFarMS += randomTimeGapMS;
        }

        // The final goal/finish line after the obstacles
        setTimeout(() => {
            const goal = gen("div");
            goal.classList.add("goal", "sliding-layer");
            qs("#dino-game").appendChild(goal);
        }, sumTimeGapSoFarMS);
    }

    function checkCollision() {
        
    }

    function openGame() {
        console.log("open game!");
        hideAll("section");  // clears all page views in index.html
        showView("#dino-game");
        generateMap();
    }

    init();
})();
