/**
 * @author Pearl Chen
 * Set game event handlers!
 */

(function () {
    "use strict";
    const STYLES = ["solid", "outline", "striped"];
    const COLORS = ["green", "purple", "red"];
    const SHAPES = ["diamond", "oval", "squiggle"];
    const COUNTS = [1, 2, 3];
    const ATTRIBUTES = [STYLES, COLORS, SHAPES, COUNTS];

    const IMG_PATH = "imgs/";

    let setCount = 0;
    let timeRemainingS;

    function init() {
        qs("#start-btn").addEventListener("click", startGame);
        qs("#back-btn").addEventListener("click", toggleView);
    }

    // Toggle between game and menu view
    function toggleView() {
        qs("#game-view").classList.toggle("hidden");
        qs("#menu-view").classList.toggle("hidden");
    }

    function startGame() {
        toggleView();
        startTimer();
    }

    function endGame() {
        // Disable card selection
        qsa(".card").forEach((card) => {
            card.removeEventListener("click", cardSelected);
        });

        // Unselect selected cards
        qsa(".selected").forEach((card) => {
            card.classList.remove("selected");
        });

        clearInterval(timerId);
    }

    /**
     * Starts the timer for a new game. No return value.
     */
    function startTimer() {
        timeRemainingS = qs("select").value;
        timerId = setInterval(advanceTimer, 1000);
    }

    /**
     * Updates the game timer (module global and #time shown on page) by 1 second. No return value.
     */
    function advanceTimer() {
        // Check time remaining is not negative (checked after displaying text)
        if (timeRemainingS < 0) {
            endGame();
        }

        // Calculating timer view for MM:SS
        let minutes = Math.floor(timeRemainingS / 60);
        let seconds = timeRemainingS % 60;

        // Make <= 2 digits
        let minPrefix = minutes < 10 ? (minutes < 1 ? "00" : "0") : "";
        let secPrefix = seconds < 10 ? (seconds < 1 ? "00" : "0") : "";
        minutes = minPrefix + minutes;
        seconds = secPrefix + seconds;

        qs("#time").textContent = minutes + ":" + seconds;

        // Update module global variable
        timeRemainingS--;
    }

    /**
     * Returns a randomly-generated array of string attributes in the form [STYLE, SHAPE, COLOR,
     * COUNT], in that order for testing purposes
     * @param {boolean} isEasy - if true, the style attribute (1 of the 4 card attributes) should
     *      always be "solid", otherwise the style attribute should be randomly selected from
     *      ("outline", "solid", or "striped").
     * @returns {array} an array of string attributes in the form [STYLE, SHAPE, COLOR, COUNT]
     */
    function generateRandomAttributes(isEasy) {
        let attributeOptions = [];
        for (const attribute in ATTRIBUTES) {
            // Easy always has solid as attribute
            if (attribute === STYLES && isEasy) {
                attributeOptions.push("solid");
                continue;
            }

            let randomIdx = Math.floor(Math.random * attribute.length());
            let randomOption = attributes[randomIdx];
            attributeOptions.push(randomOption);
        }

        return attributeOptions;
    }

    /**
     * Returns a div element with COUNT number of img elements appended as children, such that it is
     * nique from any other card attribute set on the board
     * @param {boolean} isEasy - if true, the style of the card will always be solid, otherwise
     * each of the three possible styles is equally likely
     * @returns {object} - a div element with COUNT number of img elements appended as children
     */
    function generateUniqueCard(isEasy) {
        let attributes;
        let cardId;

        // keep generating until there's no card in #board with the same id
        let duplicates = true;
        while (duplicates) {
            let attributes = generateRandomAttributes(isEasy);
            let cardId = attributes.join("-");
            duplicates = qs("#board " + "#" + cardId) !== null;
        }

        let count = attributes[3];
        let imgSrc = IMG_PATH + attributes.slice(0, 3).join("-") + ".png";
        let card = gen("div");
        card.classList.add("card"); // for styling
        card.setAttribute("id", cardId);
        card.addEventListener("click", cardSelected);

        // appending the child images COUNT times
        for (let i = 0; i < count; i++) {
            let image = gen("img");
            image.src = imgSrc;
            image.alt = attributes.join(" ");
            card.appendChild(image);
        }

        return card;
    }

    /**
     * Returns a boolean value based on whether a given list of 3 cards comprises a Set.
     * @param {DOMList} selectedCards - A DOM list of 3 properly generated card div elements that
     * are selected. These cards should be generated from generateUniqueCard(isEasy) above.
     * @returns {boolean} - whether the cards make a set
     */
    function isASet(selectedCards) {
        let cardsAttributes = [];
        selectedCards.forEach((card) => {
            let attributes = card.id.split("-");
            cardsAttributes.push(attributes);
        });

        // Cycles through each attribute
        for (let i = 0; i < cardsAttributes[0].length; i++) {
            if (
                // If 2 cards are the same, return false if the third is different
                cardsAttributes[0][i] === cardsAttributes[1][i] &&
                cardsAttributes[1][i] !== cardsAttributes[2][i]
            ) {
                return false;
            } else if (
                // If 2 cards are the different, return false if the third is the same as either
                cardsAttributes[0][i] !== cardsAttributes[1][i] &&
                (cardsAttributes[2][i] === cardsAttributes[1][i] ||
                    cardsAttributes[2][i] === cardsAttributes[0][i])
            ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Used when a card is selected, checking how many cards are currently selected. If 3 cards are
     * selected, uses isASet to handle "correct" and "incorrect" cases. No return value.
     */
    function cardSelected() {
        this.classList.toggle("selected");

        let selectedCards = qsa(".selected");
        if (selectedCards.length === 3) {
            let isSet = isASet(selectedCards);

            selectedCards.forEach((card) => {
                // Unselect all three cards
                card.classList.remove("selected");

                //to do 1s msg
                if (isSet) {
                    //todo
                } else {
                    
                }
            });
        }
    }
    init();
})();
