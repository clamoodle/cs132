(function () {
    "use strict";
    const JUMP_COOLDOWN_MS = 700; // time in MS, double the time in game-styles.css to jump up
    const COLLISION_LENIENCY_PX = 20;
    const NUM_OBSTACLES = 1;
    const BUFFER_TIME_BEFORE_GAME_ENDS_MS = 2000 * NUM_OBSTACLES;
    const IMG_PATH = "media/";
    const OBSTALCE_IMGS = ["diamond-obstacle.png", "oval-obstacle.png", "squiggle-obstacle.png"];

    // frame rate of browser CSS animation, <=60 according to mdn:
    // https://developer.mozilla.org/en-US/docs/Web/Performance/Animation_performance_and_frame_rate
    const FRAME_RATE_FPS = 60;

    // minimum and maximum time in MS between each obstacle
    const OBSTACLE_MIN_TIME_GAP_MS = 1000;
    const OBSTACLE_MAX_TIME_GAP_MS = 7000;

    let obstacleCount = NUM_OBSTACLES;
    let timerId = null;

    function init() {
        window.addEventListener("keydown", avatarControl);
        timerId = setInterval(handleCollision, 1000 / FRAME_RATE_FPS);

        // initial obstacle count text
        qs("#obstacle-count").textContent = "Obstacles left: " + obstacleCount;

        openGame();
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

    /**
     * Determines whether 2 bodies are colliding.
     * Define collision here by: (both obstacles & goal)
     * When the left-most point of the obstacle is half-way across the avatar in the x-direction
     * we have a collision if the bottom-most point of the avatar is below the top-most point
     * of the obstacle
     * @param {object} avatar - DOM element of one avatar whose collisions we track
     * @param {object} target - DOM element of one target to check collisions against
     * @returns {boolean} - whether the avatar and the target are colliding
     */
    function isColliding(avatar, target) {
        // Getting avatar left, width, and bottom
        // Source: https://stackoverflow.com/questions/2440377/javascript-collision-detection
        let avatarRect = avatar.getBoundingClientRect();
        // Getting obstacle left and top coordinates
        let obstacleRect = target.getBoundingClientRect();
        
        // Note all coordinates here are x, y based on the top-left of window being the origin
        if (
            obstacleRect.left <= avatarRect.left + avatarRect.width / 2 &&
            obstacleRect.left >= avatarRect.left &&  // between midpoint and left of avatar
            avatarRect.bottom > obstacleRect.top + COLLISION_LENIENCY_PX
        ) {
            return true;
        }
    }

    /**
     * Collision handler
     * - penalties when hit obstacle
     * - wins game when hit goal
     */
    function handleCollision() {
        let avatar = qs("#avatar");

        // Checking collisions for each obstacle
        qsa(".obstacle").forEach((element) => {
            if (isColliding(avatar, element)) {
                console.log("collide!");
                // pauseAllSlidingAnimation();
                // clearInterval(timerId); 
                // Collision handling
                // todo: invincible function: flash avatar, no collisions
                //       also gets pushed back
                //       game over when against the left edge of viewport
            }
        });

        // Wins game if collides with goal!
        if (isColliding(avatar, qs(".goal"))) {
            console.log("collide")
            pauseAllSlidingAnimation();
            clearInterval(timerId);  // Stop the collision checker timer
        }
    }

    /**
     * Pause or unpause all sliding animation
     * @param {boolean} pause - whether we true: want to pause, or false: want to run all of them
     * @param {boolean} pauseAvatar - whether we want to pause our lil' avatar as well
     */
    function pauseAllSlidingAnimation(pause = true, pauseAvatar = true) {
        let slideState = pause ? "paused" : "running";
        let avatarState = pauseAvatar ? "paused" : "running";
        qsa(".sliding-layer").forEach((element) => {
            element.style.animationPlayState = slideState;
        });
        qs("#avatar").style.animationPlayState = avatarState;
    }

    function changeHeaderColor() {
        qs("#menu-button").src = "media/red-menu-button.png";
        qs("#music-toggle").classList.add("red");
    }

    function changeMusic() {
        let music = qs("#music");
        music.src = "media/in-game-tense.wav";
        if (!qs("#music-toggle").classList.contains("muted")) {
            music.play();
        }
    }

    function generateObstacle() {
        // Generate new obstacle img node with random src
        let randomIdx = Math.floor(Math.random() * OBSTALCE_IMGS.length);
        const newObstacle = gen("img");
        newObstacle.src = IMG_PATH + OBSTALCE_IMGS[randomIdx];
        newObstacle.classList.add("obstacle", "sliding-layer");
        newObstacle.alt = OBSTALCE_IMGS[randomIdx].replace("-", " ").slice(0, -4);
        qs("#dino-game").appendChild(newObstacle);

        newObstacle.addEventListener("animationend", () => {
            this.parentNode.removeChild(this);  // we don't need them once outside of the viewport
        });

        // Update obstacle count
        obstacleCount--;
        qs("#obstacle-count").textContent = "Obstacles left: " + obstacleCount;
    }

    function generateMap() {
        let sumTimeGapSoFarMS = 0;
        let randomTimeGapMS = 0;

        // Generating obstacles sliding across the screen
        for (let i = 0; i < NUM_OBSTACLES; i++) {
            setTimeout(generateObstacle, randomTimeGapMS + sumTimeGapSoFarMS);

            // Update random time gap
            randomTimeGapMS =
                Math.floor(Math.random() * (OBSTACLE_MAX_TIME_GAP_MS - OBSTACLE_MIN_TIME_GAP_MS)) +
                OBSTACLE_MIN_TIME_GAP_MS;
            sumTimeGapSoFarMS += randomTimeGapMS;
        }

        // The final goal/finish line after the obstacles
        setTimeout(() => {
            const goal = gen("img");
            goal.src = IMG_PATH + "goal.png";
            goal.classList.add("goal", "sliding-layer");
            goal.alt = "goal";
            qs("#dino-game").appendChild(goal);
            
        }, sumTimeGapSoFarMS + BUFFER_TIME_BEFORE_GAME_ENDS_MS);
    }

    function openGame() {
        hideAll("section"); // clears all page views in index.html
        changeMusic();
        changeHeaderColor();
        showView("#dino-game");
        generateMap();
    }

    addEventListenerToAll(".start-game-button", "click", init);
    init();
})();
