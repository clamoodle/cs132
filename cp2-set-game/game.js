(function() {
    AVATAR = qs("#avatar")
    JUMP_COOLDOWN_MS = 600; // time in MS, twice the time in game-styles.css to jump up

    function init() {
        window.addEventListener("keydown", avatarControl);
    }

    function avatarControl(e) {
        console.log(AVATAR.style.animationPlayState);
        AVATAR.style.animationPlayState = "paused";
        console.log(AVATAR.style.animationPlayState);
        switch (e.keyCode) {
            // jumping case
            case 38: case 32: // up or space key respectively
                jump(AVATAR);
        }
        // AVATAR.style.animationPlayState = "running";
    }

    // Makes whoever the target is jump up and land down
    function jump(target) {
        if (!target.classList.contains("jump")) {
            target.classList.add("jump");
        }
        removeJump = () => {
            target.classList.remove("jump");
        }
        setTimeout(removeJump, JUMP_COOLDOWN_MS);
    }

    init();
})();