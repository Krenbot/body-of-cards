/* CLASS DECLARATIONS */
// Cards Class to represent each card pulled from the Deck of Cards API
class Card {
    #imgElement; // private member variable

    constructor(cardCode, image, images, value, suit) {
        this.code = cardCode;
        this.image = new URL(image);
        this.images = images;
        this.value = value;
        this.suit = suit;

        this.#convertImagesObject(images);

        // if (this.image.href.slice(-3) !== "svg") {
        //     this.image = this.images.svg;
        // }

        this.#imgElement = "";
    }

    getImgElement() {
        if (this.#imgElement === "") {
            this.createImgElement();
        }
        return this.#imgElement;
    }

    createImgElement() {
        // TODO: Refactor to pass appropriate image element for HTML purposes.
        var img = document.createElement("img");
        img.src = this.image.href;
        img.alt = this.value + " of " + this.suit;
        this.#imgElement = img;
    }

    #convertImagesObject(stringObj) {
        var objectKeys = Object.keys(stringObj);
        for (var i = 0; i < objectKeys.length; i++) {
            stringObj[objectKeys[i]] = new URL(stringObj[objectKeys[i]]);
        }
    }

    // TODO: Add any methods needed for card manipulation
}

// Deck of Cards Class used as a wrapper for the Deck of Cards API.
class DeckOfCards {
    constructor(number = 1) {
        this.baseURL = new URL("https://deckofcardsapi.com/api/deck/");
        this.id = "";
        this.shuffled = "";
        this.remaining = "";
        this.decks = number;
    }

    resetURL() {
        this.baseURL = new URL("https://deckofcardsapi.com/api/deck/");
    }

    async shuffle() {
        // TODO: Implement functionality for multiple decks
        this.resetURL();
        var result;

        if (this.id === "") {
            this.baseURL.pathname += "new/shuffle/"
            this.baseURL.searchParams.append("deck_count", 1);
        } else {
            this.baseURL.pathname += (this.id + "/shuffle/");
        }

        result = await (await fetch(this.baseURL.href)).json();
        this.id = result.deck_id;
        this.shuffled = result.shuffled;
    }

    async draw(count = 1) {
        this.resetURL();

        var result;
        var cards = [];

        if (this.id === "") {
            this.baseURL.pathname += "new/draw/";
        } else {
            this.baseURL.pathname += (this.id + "/draw/");
        }
        this.baseURL.searchParams.append("count", count);

        result = await (await fetch(this.baseURL.href)).json();
        for (var i = 0; i < result.cards.length; i++) {
            var temp = new Card(result.cards[i].code,
                result.cards[i].image, result.cards[i].images,
                result.cards[i].value, result.cards[i].suit);

            cards.push(temp);
        }
        this.id = result.deck_id;
        this.remaining = result.remaining;
        //localStorage.setItem("draw-latest", JSON.stringify(cards));

        return cards;
    }

    async newDeck(shuffleBool = 1, addJokers = false) {
        // TODO: Implement functionality for multiple decks
        // TODO: Change input to take an object rather than passing variables
        this.resetURL();

        var result;

        this.baseURL.pathname += "new/";
        if (shuffleBool) {
            this.baseURL.pathname += "shuffle/";
        }

        if (addJokers) {
            this.baseURL.searchParams.append("jokers_enabled", "true");
        }

        result = await (await fetch(this.baseURL.href)).json();
        this.id = result.deck_id;
        this.shuffled = result.shuffled;
        this.remaining = result.remaining;
    }

    getCards(count) {
        this.shuffle();
        const cardList = this.draw(count);

        // TODO: Write cards to html objects. May need to refactor getCards or implement new method to write cards to html.
    }

    returnToDeck() {
        // TODO: Implement method for returning cards to the deck API. May not be needed for the MVP
    }

    // TODO: Implement simple instructions for using the DeckOfCards Class
    // TODO: Add comments explaining the why's of each method
};

class Exercise {
    constructor() {
        this.baseURL = new URL("https://exerciseapi3.p.rapidapi.com/search/");
        this.force = "";
        this.name = "";
        this.primaryMuscles = [];
        this.secondaryMuscles = [];
        this.type = "";
        this.workoutType = [];
        this.video = null;
    }

    // Key below is provided by James Perry (PBP66) on https://rapidapi.com/
    // Must access by invoking the class instance, not the object instance
    static fetchOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0198bbaf50msh1011edbb678ad4bp19a4a1jsn246309d212b1',
            'X-RapidAPI-Host': 'exerciseapi3.p.rapidapi.com'
        }
    };

    static allMuscles = ['pectoralis major', 'biceps', 'abdominals', 'sartorius', 'abductors', 'trapezius', 'deltoid', 'latissimus dorsi', 'serratus anterior', 'external oblique', 'brachioradialis', 'finger extensors', 'finger flexors', 'quadriceps', 'hamstrings', 'gastrocnemius', 'soleus', 'infraspinatus', 'teres major', 'triceps', 'gluteus medius', 'gluteus maximus'];

    // Individual lists to draw upon for suits
    // TODO: Consider an object with the suits as keys?
    // TODO: Best practice to have these as class properties or remove static so they are referenced by the instance?
    static clubsMuscles = [];
    static diamondsMuscles = [];
    static spadesMuscles = [];
    static heartsMuscles = [];

    static allExercises = []; // TODO: Update at a later date once API provides easy access

    resetURL() {
        this.baseURL = new URL("https://exerciseapi3.p.rapidapi.com/search/");
    }

    async getAllMuscles() {
        // Currently does not provide much functionality for the users with card games
        this.resetURL();

        this.baseURL.pathname += "muscles/";
        return await (await fetch(this.baseURL.href, Exercise.fetchOptions)).json();
    }

    async getExerciseByName(exercise) {
        this.resetURL();

        var exercises = [];
        this.baseURL.searchParams.append("name", capitalizeEachWord(exercise));

        exercises = await (await fetch(this.baseURL.href, Exercise.fetchOptions)).json();
        exercises = Exercise.#convertFetchResponseToObjects(exercises);

        localStorage.setItem(capitalizeEachWord(exercise), JSON.stringify(exercises));
        return exercises;
    }

    async getExercisesByPrimaryMuscle(pMuscle) {
        this.resetURL();

        var exercises = [];
        this.baseURL.searchParams.append("primaryMuscle", pMuscle.toLowerCase());

        exercises = await (await fetch(this.baseURL.href, Exercise.fetchOptions)).json();
        exercises = Exercise.#convertFetchResponseToObjects(exercises);

        localStorage.setItem(pMuscle.toLowerCase(), JSON.stringify(exercises));
        return exercises;
    }

    async getExercisesBySecondaryMuscle(sMuscle) {
        this.resetURL();

        var exercises = [];
        this.baseURL.searchParams.append("secondaryMuscle", sMuscle.toLowerCase());

        exercises = await (await fetch(this.baseURL.href, Exercise.fetchOptions)).json();
        exercises = Exercise.#convertFetchResponseToObjects(exercises);

        localStorage.setItem(sMuscle.toLowerCase(), JSON.stringify(exercises));
        return exercises;
    }

    // TODO: Comment method below to explain its purpose and summarize its flow
    static #convertAPIObject(apiObject) {
        var properties = Object.keys(apiObject);
        var oldProperty;
        var firstLetter;
        for (var i = 0; i < properties.length; i++) {
            oldProperty = properties[i];
            properties[i] = properties[i].split(" ");
            if (properties[i][0].toLowerCase() === "youtube") {
                properties[i] = "video";
            } else {
                for (var j = 0; j < properties[i].length; j++) {
                    if (j === 0) {
                        firstLetter = properties[i][j][0].toLowerCase();
                    } else {
                        firstLetter = properties[i][j][0].toUpperCase();
                    }
                    properties[i][j] = firstLetter + properties[i][j].substring(1);
                }
                properties[i] = properties[i].join("");
            }
            delete Object.assign(apiObject, { [properties[i]]: apiObject[oldProperty] })[oldProperty];
        }
        apiObject.video = new URL(apiObject.video);
        return apiObject;
    }

    // TODO: Comment method below to explain its purpose and summarize its flow
    static #convertFetchResponseToObjects(response) {
        var dataList = [];
        var objectList = [];
        dataList = Object.keys(response);
        for (var i = 0; i < dataList.length; i++) {
            var temp = new Exercise();
            Object.assign(temp, Exercise.#convertAPIObject(response[dataList[i]]));
            objectList.push(temp);
        }
        return objectList;
    }
}

/* VARIABLE DECLARATION */
var timerText = document.getElementById("timerText");
var startBtn = document.getElementById("timerStart");
var timerStatus = "new";
var interval;

/* FUNCTION DECLARATION */
function startTimer() {
    var timerCount;
    if (timerStatus === "new") {
        timerCount = 0;

        timerText.innerHTML = 0;
        timerStatus = "running";
        startBtn.innerHTML = "Stop";

        interval = setInterval(function () {
            timerCount++;
            timerText.innerHTML = timerCount;
        }, 1000);

    } else if (timerStatus === "running") {
        timerStatus = "stopped";
        startBtn.innerHTML = "Reset";
        clearInterval(interval);
        interval = null;

    } else if (timerStatus === "stopped") {
        timerStatus = "new";
        startBtn.innerHTML = "Start Timer";
        timerText.innerHTML = "";
    }
}

function capitalizeEachWord(stringInput) {
    var words = stringInput.split(" ");
    var newWords = [];
    for (var i = 0; i < words.length; i++) {
        newWords.push(words[i][0].toUpperCase() + words[i].substring(1).toLowerCase());
    }
    return newWords.join(" ");
}

/* MAIN CODE EXECUTION AREA */

startBtn.addEventListener("click", startTimer);

// TODO: For each card container: add javascript to access the DOM element, navigate its child elements until the img container is found, replace its innerHTML with the card img link from the API.
// TODO: Once the card img html is updated, use the Exercise class to pull the exercise that corresponds with the card (use card code?). Will need additional javascript to link the two...
// TODO: Update the html element with the exercise. 
// TODO: Add muscle and/or exercise group/type to the card as well?

// DEV TESTING SECTION
//var testObj = new DeckOfCards();
//testObj.getCards(5);
//var exerciseObj = new Exercise();
//exerciseObj.getExercisesByPrimaryMuscle("deltoid");

// Modal JS
document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add('is-active');
    }

    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});

var acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}

document.getElementById("rulesBtn").addEventListener("click", rulesButtonFunction);

function rulesButtonFunction() {
    document.getElementById("rulesModal").setAttribute("class", "modal is-active");
}
var swapBtns = document.querySelectorAll(".bulma-control-mixin")
for (let i = 0; i < swapBtns.length; i++) {
    swapBtns[i].addEventListener("click", async function (event) {
        var newDeck = new DeckOfCards

        var newCardDraw = await newDeck.draw()
        console.log(newCardDraw)
        console.log(newCardDraw[0])

        var cardsDivsImage = document.getElementById(i.toString())
        console.log(i)
        console.log(cardsDivsImage)
        console.log(JSON.parse(localStorage.getItem("draw-latest"))[0].image)
        cardsDivsImage.setAttribute("src", JSON.parse(localStorage.getItem("draw-latest"))[0].image)

    })
}
