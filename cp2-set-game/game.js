(function () {
    "use strict";
    const JUMP_COOLDOWN_MS = 600; // time in MS, the time in game-styles.css to jump up
    const NUM_OBSTACLES = 10;
    // minimum and maximum time in MS between each obstacle
    const OBSTACLE_MIN_TIME_GAP_MS = 500;
    const OBSTACLE_MAX_TIME_GAP_MS = 3000;

    function init() {
        window.addEventListener("keydown", avatarControl);
        generateMap();
    }

    function avatarControl(e) {
        let avatar = qs("#avatar");

        // console.log(AVATAR.style.animationPlayState);
        // AVATAR.style.animationPlayState = "paused";
        // console.log(AVATAR.style.animationPlayState);
        switch (e.keyCode) {
            // jumping case
            case 38:
            case 32: // up or space key respectively
                jump(avatar);
        }
        // AVATAR.style.animationPlayState = "running";
    }

    // Makes whoever the target is jump up and land down
    function jump(target) {
        if (!target.classList.contains("jump")) {
            // target.style.animation = "jump 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) alternate infinite";
            // target.style.animationIterationCount = "2";
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
            console.log(randomTimeGapMS);
            console.log(sumTimeGapSoFarMS);
            setTimeout(() => {
                const newObstacle = document.createElement("div");
                newObstacle.classList.add("obstacle", "sliding-layer");
                qs("#game").appendChild(newObstacle);
           }, randomTimeGapMS + sumTimeGapSoFarMS);
           sumTimeGapSoFarMS += randomTimeGapMS; 
        }

        // The final goal/finish line after the obstacles
        setTimeout(() => {
            const goal = document.createElement("div");
            goal.classList.add("goal", "sliding-layer");
            qs("#game").appendChild(goal);
       }, sumTimeGapSoFarMS);
    }

    init();
})();
