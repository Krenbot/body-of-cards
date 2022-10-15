/* CLASS DECLARATIONS */
// Cards Class to represent each card pulled from the Deck of Cards API
class Card {
    // Private Class Properties
    #imgElement; 
    #codeToValue = { // TODO: Need to add joker
        "J": "JACK",
        "Q": "QUEEN",
        "K": "KING",
        "A": "ACE",
    };

    #codeToSuit = {
        "C": "CLUBS", 
        "D": "DIAMONDS", 
        "S": "SPADES", 
        "H": "HEARTS"};

    // Constructor Definition
    constructor(cardCode, image, images, value, suit) {
        this.code = cardCode;
        this.value = value;
        this.suit = suit;

        this.image = image;
        if (image != null) {
            this.image = new URL(this.image);
        }
        
        this.images = images;
        if (images != null) {
            this.#convertImagesObject(images);
        }

        if (!(this.value) || !(this.suit)) {
            this.#convertCardCode();
        }

        // this.setImageTypeToSVG();

        this.#imgElement = "";
    }

    // Class Methods
    getImgElement() {
        if (this.#imgElement === "") {
            this.createImgElement();
        }
        return this.#imgElement;
    }

    createImgElement() {
        let img = document.createElement("img");
        img.id = this.code;
        img.src = this.image.href;
        img.alt = this.value + " of " + this.suit;
        this.#imgElement = img;
    }

    // TODO: Upgrade method(s) to include other file types: PNG, JPEG
    setImageTypeToSVG() {
        if (this.image.href.slice(-3) !== "svg") {
            this.image = this.images.svg;
        }
    }

    // Private Class Methods
    #convertImagesObject(stringObj) {
        let objectKeys = Object.keys(stringObj);
        for (let i = 0; i < objectKeys.length; i++) {
            stringObj[objectKeys[i]] = new URL(stringObj[objectKeys[i]]);
        }
    }

    #convertCardCode() {
        let cardCode = this.code.split("");
        console.log(cardCode);
        if (Number.isNaN(cardCode[0])) {
            this.value = this.#codeToValue[cardCode[0]];
        } else {
            this.value = cardCode[0];
        }
        this.suit = this.#codeToSuit[cardCode[1]];
    }

    //Add any methods needed for card manipulation
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
        let result;

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

        let result;
        let cards = [];

        if (this.id === "") {
            this.baseURL.pathname += "new/draw/";
        } else {
            this.baseURL.pathname += (this.id + "/draw/");
        }
        this.baseURL.searchParams.append("count", count);

        result = await (await fetch(this.baseURL.href)).json();
        for (let i = 0; i < result.cards.length; i++) {
            let temp = new Card(result.cards[i].code,
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

        let result;

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

    returnCardToDeck() {
        // TODO: Implement method for returning cards to the deck API. NOT needed for the MVP
        // TODO: Connect with the swap button method. Whenever swapping cards, that card needs to return to the desk to be reused.
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

    static allExercises = []; // TODO: Update at a later date once API provides easy access

    static allMuscles = ['pectoralis major', 'biceps', 'abdominals', 'sartorius', 'abductors', 'trapezius', 'deltoid', 'latissimus dorsi', 'serratus anterior', 'external oblique', 'brachioradialis', 'finger extensors', 'finger flexors', 'quadriceps', 'hamstrings', 'gastrocnemius', 'soleus', 'infraspinatus', 'teres major', 'triceps', 'gluteus medius', 'gluteus maximus'];

    // Object to convert from suit to a list of associated muscles
    // TODO: Best practice to have these as class properties or remove static so they are referenced by the instance?
    static suitToMuscles = {
        "CLUBS": ['biceps', 'deltoid', 'brachioradialis', 'finger extensors', 'finger flexors', 'triceps'],
        "DIAMONDS": ['pectoralis major', 'abdominals', 'serratus anterior','external oblique'],
        "SPADES": ['sartorius', 'abductors', 'quadriceps', 'hamstrings', 'gastrocnemius', 'soleus', 'gluteus medius', 'gluteus maximus'],
        "HEARTS": ['trapezius', 'latissimus dorsi', 'infraspinatus','teres major']
    };

    resetURL() {
        this.baseURL = new URL("https://exerciseapi3.p.rapidapi.com/search/");
    }

    getMuscle(suit) {
        let index = randomInt(this.suitToMuscles[suit].length);
        return Exercise.suitToMuscles[suit][index];
    }

    async getAllMuscles() {
        // Currently does not provide much functionality for the users with card games
        this.resetURL();

        this.baseURL.pathname += "muscles/";
        return await (await fetch(this.baseURL.href, Exercise.fetchOptions)).json();
    }

    async getExercises(apiMethod, value) {
        let exercises = [];
        let exerciseNames = [];
        this.resetURL();
        switch(apiMethod) {
            case "name":
                value = capitalizeEachWord(value);
                break;
            case "primaryMuscle":
                value = value.toLowerCase();
                break;
            case "secondaryMuscle":
                value = value.toLowerCase();
                break;
            default: 
                console.log("Bad value provided to getExercises()\n" + 
                    "API method provided: " + apiMethod + "\nValue provided: " + 
                    value + "\nCurrent exercise instance object: " + this);
        }

        this.baseURL.searchParams.append(apiMethod, value);
        exercises = await (await fetch(this.baseURL.href, Exercise.fetchOptions)).json();

        // Depending on the muscle chosen, some only exist as secondary muscles on the API
        if (exercises.length === 0) {
            this.getExercisesBySecondaryMuscle(value);
            return;
        }
        exercises = Exercise.#convertFetchResponseToObjects(exercises);
        for (let i = 0; i < exercises.length; i++) {
            // capitalizeEachWord takes a string only. It does NOT take an array of Exercise objects.
            localStorage.setItem(capitalizeEachWord(exercises[i].name), JSON.stringify(exercises[i]));
        }        
        return exercises;
    }

    getExerciseByName(exercise) {
        this.getExercises("name", exercise);
    }

    getExercisesByPrimaryMuscle(pMuscle) {
        this.getExercises("primaryMuscle", pMuscle);
    }

    getExercisesBySecondaryMuscle(sMuscle) {
        this.getExercises("secondaryMuscle", sMuscle);
    }

    // TODO: Comment method below to explain its purpose and summarize its flow
    static #convertAPIObject(apiObject) {
        let properties = Object.keys(apiObject);
        let oldProperty;
        let firstLetter;
        for (let i = 0; i < properties.length; i++) {
            oldProperty = properties[i];
            properties[i] = properties[i].split(" ");
            if (properties[i][0].toLowerCase() === "youtube") {
                properties[i] = "video";
            } else {
                for (let j = 0; j < properties[i].length; j++) {
                    if (j === 0) {
                        firstLetter = properties[i][j][0].toLowerCase();
                    } else {
                        firstLetter = properties[i][j][0].toUpperCase();
                    }
                    properties[i][j] = firstLetter + properties[i][j].substring(1);
                }
                properties[i] = properties[i].join("");
            }
            delete Object.assign(apiObject, 
                { [properties[i]]: apiObject[oldProperty] })[oldProperty];
        }
        apiObject.video = new URL(apiObject.video);
        return apiObject;
    }

    // TODO: Comment method below to explain its purpose and summarize its flow
    static #convertFetchResponseToObjects(response) {
        let dataList = [];
        let objectList = [];
        dataList = Object.keys(response);
        for (let i = 0; i < dataList.length; i++) {
            let temp = new Exercise();
            Object.assign(temp, 
                Exercise.#convertAPIObject(response[dataList[i]]));
            objectList.push(temp);
        }
        return objectList;
    }
}

class Timer {
    constructor() {
        this.timerText = document.getElementById("timerText");
        this.startButton = document.getElementById("timerStart");
        this.timerStatus = "new";
        this.timerCount;
        this.interval;
        
        this.startButton.addEventListener("click", this.startTimer.bind(this));
    }

    startTimer() {
        if (this.timerStatus === "new") {
            this.initialize();
            this.interval = setInterval(this.updateTimer.bind(this), 1000);
        } else if (this.timerStatus === "running") {
            this.update(this.timerCount, this.timerCount, "stopped", "Reset");
            this.clear();
        } else if (this.timerStatus === "stopped") {
            this.update(0, "", "new", "Start Timer")
        }
    }

    initialize() {
        this.update(0, 0, "running", "Stop");
    }

    update(count, timerText, status, buttonText) {
        this.timerCount = count;
        this.timerText.innerHTML = timerText;
        this.timerStatus = status;
        this.startButton.innerHTML = buttonText;
    }

    updateTimer() {
        this.timerCount++;
        this.timerText.innerHTML = this.timerCount;
    }

    clear() {
        clearInterval(this.interval);
        this.interval = null;
    }
}

/* FUNCTION DECLARATIONS */
function capitalizeEachWord(stringInput) {
    let words = stringInput.split(" ");
    let newWords = [];
    for (let i = 0; i < words.length; i++) {
        newWords.push(words[i][0].toUpperCase() + words[i].substring(1).toLowerCase());
    }
    return newWords.join(" ");
}

async function loadCards(deck) {
    let numCards;
    let cards;
    let exercises = [];
    let muscles = [];
    //exerciseContentContainers
    numCards = cardContainers.length;
    cards = await deck.draw(numCards);
    for (let i = 0; i < numCards; i++) {
        cardContainers[i].innerHTML = "";
        cardContainers[i].appendChild(cards[i].getImgElement());

        exercises.push(new Exercise());
        muscles.push(exercises[i].getMuscle(cards[i].suit));
        //exercises[i].getExercisesByPrimaryMuscle(muscles[i]);
    }

function rulesButtonFunction() {
    document.getElementById("rulesModal").setAttribute("class", 
        "modal is-active");
}

function randomInt(range) {
    return Math.floor(Math.random() * range);
}

// TODO: Consider remaking the modal code below into a class to wrap everything?
// START MODAL JS CODE
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

let acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        /* Toggle between adding and removing the "active" class,
        to highlight the button that controls the panel */
        this.classList.toggle("active");

        /* Toggle between hiding and showing the active panel */
        let panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    });
}
// END MODAL JS CODE

/* MAIN CODE EXECUTION AREA */
// TODO: Below variables are global variables. Can they be wrapped into a class or function?
let cardContainers = document.getElementsByClassName("card-image");
let exerciseContentContainers = document.getElementsByClassName("card-content");
let exerciseDeck = new DeckOfCards();
let timer = new Timer(); // Automatically generates an event listener on page load through class initialization

// Add event listeners
document.getElementById("rulesBtn").addEventListener("click", rulesButtonFunction);

// On page load, set the cards and exercises.
loadCards(exerciseDeck);

// TODO: Once the card img html is updated, use the Exercise class to pull the exercise that corresponds with the card (use card code?). Will need additional javascript to link the two...
// TODO: Update the html element with the exercise. 
// TODO: Add muscle and/or exercise group/type to the card as well?

// Test code for swap
let swapButtons = document.querySelectorAll(".bulma-control-mixin");
let newDeck = new DeckOfCards();
let draw;

for (let i = 0; i < swapButtons.length; i++) {
    swapButtons[i].addEventListener("click", async function () {
        draw = await newDeck.draw();
        cardContainers[i].innerHTML = "";
        cardContainers[i].appendChild(draw[0].getImgElement());
    })
}

class Swap {
    constructor(deck, buttonElement, containerElement) {
        this.deck = deck;
        this.button = buttonElement;
        this.container = containerElement;
        this.currentCard;
        this.newCard;

        this.createButtonEventListener();
    }

    createButtonEventListener() {
        this.button.addEventListener("click", this.swapCard.bind(this));
    }

    loadCurrentCard() {
        console.log(this.container);
        console.log(this.container.innerHTML);
    }

    async getNewCard() {
        this.newCard = await this.deck.draw(1);
        return this.newCard;
    }

    swapCard() {
        this.cardContainer.innerHTML = "";
        this.cardContainer.appendChild(this.newCard.getImgElement());
    }
}

//let test = new Swap();