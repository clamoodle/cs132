/**
 * Handles music and theme changes across pages, and all in-game actions of the dino-game
 */
(function () {
    "use strict";
    const JUMP_COOLDOWN_MS = 700; // time in MS, double the time in game-styles.css to jump up
    const COLLISION_LENIENCY_PX = 20;
    const NUM_OBSTACLES = 11;
    const BUFFER_TIME_BEFORE_GAME_ENDS_MS = 2000;

    const IMG_PATH = "media/";
    const OBSTALCE_IMGS = ["diamond-obstacle.png", "oval-obstacle.png", "squiggle-obstacle.png"];

    const MUSIC_PATH = "media/";
    const WELCOME_SONG = "genius-soft-adventurous-theme.wav";
    const IN_GAME_SONG = "in-game-tense.wav";
    const GAME_END_SONG = "silly-tune.wav";
    const CREATE_SONG = "calm-genius-silly-theme.wav";

    // frame rate of browser CSS animation, <=60 according to mdn:
    // https://developer.mozilla.org/en-US/docs/Web/Performance/Animation_performance_and_frame_rate
    const FRAME_RATE_FPS = 60;

    // minimum and maximum time in MS between each obstacle
    const OBSTACLE_MIN_TIME_GAP_MS = 1000;
    const OBSTACLE_MAX_TIME_GAP_MS = 7000;

    let obstacleCount = NUM_OBSTACLES;
    let gameOver = false;
    let timerId = null;

    function init() {
        qs("#create-button").addEventListener("click", showCreateChar);
        addEventListenerToAll(".start-game-button", "click", initGame);
        addEventListenerToAll(".back-button", "click", showWelcome);
    }

    function showCreateChar() {
        hideAll("section"); // clears all page views in index.html
        showView("#char-creation-view");
        changeMusic(CREATE_SONG);
    }

    function initGame() {
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
        if (!target) {
            return false;
        }

        // Getting avatar left, width, and bottom
        // Source: https://stackoverflow.com/questions/2440377/javascript-collision-detection
        let avatarRect = avatar.getBoundingClientRect();
        // Getting obstacle left and top coordinates
        let obstacleRect = target.getBoundingClientRect();

        // Note all coordinates here are x, y based on the top-left of window being the origin
        if (
            obstacleRect.left <= avatarRect.left + avatarRect.width / 2 &&
            obstacleRect.left >= avatarRect.left && // between midpoint and left of avatar
            avatarRect.bottom > obstacleRect.top + COLLISION_LENIENCY_PX
        ) {
            return true;
        }
    }

    /**
     * Handles the event of game over
     * @param {boolean} won - whether the player cleared the game
     */
    function didPlayerWin(won) {
        gameOver = true;
        changeMusic(GAME_END_SONG);
        qs("#popup-msg").textContent = won
            ? "You won! Yayayy!"
            : "Game over! Better luck next time :,(";
        qs("#popup-window").classList.remove("hidden");
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
                pauseAllSlidingAnimation();
                clearInterval(timerId);
                didPlayerWin(false);
                // Collision handling
                // todo: invincible function: flash avatar, no collisions
                //       also gets pushed back
                //       game over when against the left edge of viewport
            }
        });

        // Wins game if collides with goal!
        if (isColliding(avatar, qs(".goal"))) {
            pauseAllSlidingAnimation();
            clearInterval(timerId); // Stop the collision checker timer
            didPlayerWin(true);
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

    /**
     * Changes the color of header icons between views
     * @param {boolean} inGame - whether we want red in-game header colors or not
     */
    function changeHeaderColor(inGame) {
        if (inGame) {
            qs("#menu-button").src = IMG_PATH + "red-menu-button.png";
            qs("#music-toggle").classList.add("red");
        } else {
            qs("#menu-button").src = IMG_PATH + "menu-button.png";
            qs("#music-toggle").classList.remove("red");
        }
    }

    /**
     * Changes the background track
     * @param {string} song - the pile path to the audio file we wish to play
     */
    function changeMusic(song) {
        let music = qs("#music");

        // Checking for not playing the same track again if we're on the same page
        // Slicing for getting rid of "index.html?"
        if (music.src === window.location.href.slice(0, -11) + MUSIC_PATH + song) {
            return;
        }

        music.src = MUSIC_PATH + song;
        // console.log(music.src);
        if (!qs("#music-toggle").classList.contains("muted")) {
            music.play();
        }

        // silly-tune.wav is a bit loud :,D
        if (song === "silly-tune.wav") {
            music.volume = 0.5;
        } else {
            music.volume = 1;
        }
    }

    function showWelcome() {
        hideAll("section"); // clears all page views in index.html
        showView("#welcome-view");

        changeHeaderColor(false);
        changeMusic(WELCOME_SONG);
        pauseAllSlidingAnimation(false, false);
    }

    // Generating obstacles sliding across the screen
    function generateObstacle() {
        if (gameOver || obstacleCount === 0) {
            return;
        }

        // Generate new obstacle img node with random src
        let randomIdx = Math.floor(Math.random() * OBSTALCE_IMGS.length);
        const newObstacle = gen("img");
        newObstacle.src = IMG_PATH + OBSTALCE_IMGS[randomIdx];
        newObstacle.classList.add("obstacle", "sliding-layer");
        newObstacle.alt = OBSTALCE_IMGS[randomIdx].replace("-", " ").slice(0, -4);
        qs("#dino-game").appendChild(newObstacle);

        // Update obstacle count
        obstacleCount--;
        qs("#obstacle-count").textContent = "Obstacles left: " + obstacleCount;

        // Remove them once outside of the viewport
        if (newObstacle) {
            // if statement to prevent null error after game ends
            newObstacle.addEventListener("animationend", () => {
                this.remove();
            });
        }
    }

    /**
     * Generate obstacles with random time intervals between them and the goal at the end
     * Recursive to generate obstacles one after another
     */
    function generateMap() {
        generateObstacle();

        // Genearate random time gap
        let obstacleTimeGapMS =
            Math.floor(Math.random() * (OBSTACLE_MAX_TIME_GAP_MS - OBSTACLE_MIN_TIME_GAP_MS)) +
            OBSTACLE_MIN_TIME_GAP_MS;

        // Recursion
        if (obstacleCount > 1) {
            setTimeout(generateMap, obstacleTimeGapMS);
        } else if (!gameOver) {
            // Start sliding the final goal/finish line after the obstacles
            setTimeout(() => {
                qs(".goal").classList.add("sliding-layer");
            }, BUFFER_TIME_BEFORE_GAME_ENDS_MS);
        }
    }

    function openGame() {
        hideAll("section"); // clears all page views in index.html
        changeMusic(IN_GAME_SONG);
        changeHeaderColor(true);
        showView("#dino-game");
        generateMap();
    }

    init();
})();
