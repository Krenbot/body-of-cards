/* CLASS DECLARATIONS */
// Cards Class to represent each card pulled from the Deck of Cards API
class Card {
    // Private Class Properties
    #imgElement;
    
    // Jokers are represented as X
    #codeToValue = {
        "J": "JACK",
        "Q": "QUEEN",
        "K": "KING",
        "A": "ACE",
        "X": "JOKER"
    };
    
    // Jokers will be either 1 for the black suit or 2 for the red suit
    #codeToSuit = {
        "C": "CLUBS",
        "D": "DIAMONDS",
        "S": "SPADES",
        "H": "HEARTS",
        "1": "BLACK",
        "2": "RED"
    };

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
        if (Number.isNaN(cardCode[0])) {
            this.value = this.#codeToValue[cardCode[0]];
        } else if (parseInt(cardCode[0]) === 0) {
            this.value = 10;
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
        this.baseURL = this.resetURL();
        this.id = "";
        this.shuffled = "";
        this.remaining = "";
        this.decks = number;
    }

    resetURL() {
        this.baseURL = new URL("https://deckofcardsapi.com/api/deck/");
    }

    async shuffle(remaining = true) {
        this.resetURL();
        let result;

        // Check if a deck has been created. If not, create it on the API fetch
        if (this.id === "") {
            this.baseURL.pathname += "new/shuffle/"
        } else {
            this.baseURL.pathname += (this.id + "/shuffle/");
        }

        // Only shuffle cards that are still in the deck and have not been drawn
        if (remaining) {
            this.baseURL.searchParams.append("remaining", remaining);
        }

        this.baseURL.searchParams.append("deck_count", this.decks);
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
        return cards;
    }

    async newDeck(shuffleBool = true, addJokers = false) {
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

        this.baseURL.searchParams.append("deck_count", this.decks);
        result = await (await fetch(this.baseURL.href)).json();
        this.id = result.deck_id;
        this.shuffled = result.shuffled;
        this.remaining = result.remaining;
    }

    // Takes an array of cards to return
    async returnCardsToDeck(cardsToReturn) {
        let cardValues = [];
        let result;

        if (!(cardsToReturn instanceof Array)) {
            cardsToReturn = [cardsToReturn];
        }
        this.resetURL();
        this.baseURL.pathname += (this.id + "/return");

        for (let i = 0; i < cardsToReturn.length; i++) {
            cardValues.push(cardsToReturn[i].code);
        }

        this.baseURL.searchParams.append("cards", cardValues.join());
        result = await (await fetch(this.baseURL.href)).json();
        this.id = result.deck_id;
        this.remaining = result.remaining;
    }

    // TODO: Implement simple instructions for using the DeckOfCards Class
    // TODO: Add comments explaining the why's of each method
};

class Exercise {
    //Private Class Properties
    #fetchCount = 0;
    #exerciseElement;

    // Constructor Definition
    constructor() {
        this.baseURL = new URL("https://exerciseapi3.p.rapidapi.com/search/");
        this.force = "";
        this.name = "";
        this.primaryMuscles = [];
        this.secondaryMuscles = [];
        this.type = "";
        this.workoutType = [];
        this.video = null;

        this.#exerciseElement = "";
    }

    // Static Class Properties

    // Key below is provided by James Perry (PBP66) on https://rapidapi.com/
    // Must access by invoking the class instance, not the object instance
    static #fetchOptions = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": "0198bbaf50msh1011edbb678ad4bp19a4a1jsn246309d212b1",
            "X-RapidAPI-Host": "exerciseapi3.p.rapidapi.com"
        }
    };

    // soleus does not provide ANY VALID EXERCISES.
    static #allMuscles = ["pectoralis major", "biceps", "abdominals",
        "sartorius", "abductors", "trapezius", "deltoid", "latissimus dorsi",
        "serratus anterior", "external oblique", "brachioradialis",
        "finger extensors", "finger flexors", "quadriceps", "hamstrings",
        "gastrocnemius", "soleus", "infraspinatus", "teres major", "triceps",
        "gluteus medius", "gluteus maximus"];

    static #secondaryMuscles = ["infraspinatus", "gastrocnemius", "trapezius", 
        "abductors", "teres major", "brachioradialis", "serratus anterior", 
        "sartorius", "finger flexors", "finger extensors"];

    // Object to convert from suit to a list of associated muscles (ARMS, CHEST, LEGS, BACK)
    static #suitToMuscles = {
        "CLUBS": ["biceps", "brachioradialis", "finger extensors", "finger flexors", "triceps"],
        "DIAMONDS": ["pectoralis major", "abdominals", "serratus anterior", "external oblique", "teres major"],
        "SPADES": ["abductors", "quadriceps", "hamstrings", "gastrocnemius", "gluteus medius", "gluteus maximus"],
        "HEARTS": ["sartorius", "trapezius", "deltoid", "latissimus dorsi", "infraspinatus"]
    };

    static #suitToExerciseType = {
        "CLUBS": "ARMS",
        "DIAMONDS": "CHEST",
        "SPADES": "LEGS",
        "HEARTS": "BACK"
    };
    
    static #muscleType = {
        "pectoralis major": "CHEST", 
        "biceps": "ARMS",
        "abdominals": "CORE",
        "sartorius": "LEG", 
        "abductors": "LEG", 
        "trapezius": "BACK/SHOULDER", 
        "deltoid": "SHOULDER", 
        "latissimus dorsi": "BACK",
        "serratus anterior": "CHEST",
        "external oblique": "CORE", 
        "brachioradialis": "ARM",
        "finger extensors": "ARM", 
        "finger flexors": "ARM", 
        "quadriceps": "LEG", 
        "hamstrings": "LEG",
        "gastrocnemius": "LEG", 
        "soleus": "LEG", 
        "infraspinatus": "SHOULDER", 
        "teres major": "SHOULDER", 
        "triceps": "ARM",
        "gluteus medius": "LEG", 
        "gluteus maximus": "LEG"
    };

    // Object Methods
    resetURL() {
        this.baseURL = new URL("https://exerciseapi3.p.rapidapi.com/search/");
    }

    createExerciseElement() {
        let element = document.createElement("a");
        if (this.video == null) {
            element.href = "#";
        } else {
            element.href = this.video;
        }
        element.innerText = this.name;
        element.id = removeSpacesFromString(this.name);
        this.#exerciseElement = element;
    }

    getExerciseElement() {
        if (this.#exerciseElement === "") {
            this.createExerciseElement();
        }
        return this.#exerciseElement;
    }

    async getAllMuscles() {
        // Currently does not provide much functionality for the users with card games
        this.resetURL();

        this.baseURL.pathname += "muscles/";
        return await (await fetch(this.baseURL.href, Exercise.#fetchOptions)).json();
    }

    // TODO: Make private method
    async getExercises(apiMethod, value) {
        let exercises = [];
        this.resetURL();

        // Depending on the muscle chosen, some only exist as secondary muscles on the API
        if (Exercise.#secondaryMuscles.includes(value.toLowerCase())) {
            apiMethod = "secondaryMuscle";
        }

        switch (apiMethod) {
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
                return;
        }

        this.baseURL.searchParams.append(apiMethod, value);
        exercises = await (await fetch(this.baseURL.href, Exercise.#fetchOptions)).json();

        exercises = Exercise.#convertFetchResponseToObjects(exercises);
        // for (let i = 0; i < exercises.length; i++) {
        //     // capitalizeEachWord takes a string only. It does NOT take an array of Exercise objects.
        //     localStorage.setItem(capitalizeEachWord(exercises[i].name), JSON.stringify(exercises[i]));
        // }
        return exercises;
    }

    async getExerciseByName(exercise) {
        return await this.getExercises("name", exercise);
    }

    async getExercisesByPrimaryMuscle(pMuscle) {
        return await this.getExercises("primaryMuscle", pMuscle);
    }

    async getExercisesBySecondaryMuscle(sMuscle) {
        return await this.getExercises("secondaryMuscle", sMuscle);
    }

    async getExerciseByNames(exercises) {
        response = [];
        for (let i = 0; i < exercises.length; i++) {
            response.push(await this.getExercises("name", exercises[i]));
        }
        return response;
    }

    async getExercisesByPrimaryMuscles(pMuscles) {
        response = [];
        for (let i = 0; i < pMuscles.length; i++) {
            response.push(await this.getExercises("primaryMuscle", pMuscles[i]));
        }
        return response;
    }

    async getExercisesBySecondaryMuscles(sMuscles) {
        response = [];
        for (let i = 0; i < sMuscles.length; i++) {
            response.push(await this.getExercises("primaryMuscle", sMuscles[i]));
        }
        return response;
    }

    static getMuscle(key) {
        let index = randomInt(Exercise.#suitToMuscles[key].length);
        return Exercise.#suitToMuscles[key][index];
    }

    static getExerciseType(key) {
        return Exercise.#suitToExerciseType[key];
    }

    static getExerciseTypeByMuscle(key) {
        return Exercise.#muscleType[key];
    }

    // Private Class Methods
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
            storeExcerciseNames(this.timerText);
            localStorage.setItem("workouts", JSON.stringify(pastWorkouts));
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

// Represent an HTML container with html children
class Container { // TODO: Consider renaming to HandOfCards?
    // Private Class Properties
    #deck;
    #timer;
    #checkBoxes = []; // Each card is represented as a checkbox to control animations
    
    // The containerElement contains all Card Container classes
    constructor(containerElement) {
        this.container = containerElement;
        this.cardContainers = [];
        this.generateCardContainers();

        this.#checkBoxes = this.container.querySelectorAll('input[type=checkbox]');
        this.footers = this.container.getElementsByClassName("card-footer");
        this.generateSwapButtons();
    }

    generateCardContainers() {
        let containerElements = this.container.getElementsByClassName("card");
        for (let i = 0; i < containerElements.length; i++) {
            this.cardContainers.push(new CardContainer(containerElements[i]));
        }
    }

    generateSwapButtons() {
        let buttonElements = this.container.getElementsByClassName("bulma-control-mixin");
        for (let i = 0; i < this.footers.length; i++) {
            if (this.footers[i].children[0].children.length === 0) { // Number of Button Elements...
                let button = this.#generateSwapButton(i);
                this.setSwapButton(button, this.cardContainers[i]);
                this.footers[i].children[0].appendChild(button);
            } else {
                this.setSwapButton(buttonElements[i], this.cardContainers[i]);
            }
        }
    }

    setDeck(deck) {
        this.#deck = deck;
    }

    getDeck() {
        return this.#deck;
    }

    setTimer(timer) {
        this.#timer = timer;
        this.#timer.startButton.addEventListener("click", (() => {
            if (this.#timer.timerStatus === "new") {
                this.#reset();
            }
        }).bind(this));
    }

    getTimer() {
        return this.#timer;
    }

    async loadCards() {
        let numCards = this.cardContainers.length;
        let cards;

    
        if (!(this.#deck)) {
            this.#deck = new DeckOfCards();
        }
        cards = await this.#deck.draw(numCards);

        for (let i = 0; i < numCards; i++) {
            if (this.cardContainers[i].card.images) {
                await this.#deck.returnCardsToDeck(this.cardContainers[i].card);
            }
            await this.cardContainers[i].loadCard(cards[i]);
        }
    }

    setSwapButton(element, cardContainer) {
        element.addEventListener("click", ((event) => {
            event.target.remove(); 
            this.swapCardContents(cardContainer);
        }).bind(this));
    }

    async swapCardContents(cardContainer) {
        if (this.#timer.timerStatus === "new") {
            let draw = (await this.#deck.draw(1))[0];
            cardContainer.loadCard(draw);
        }
    }

    #generateSwapButton(index) {
        let element = document.createElement("button");
        element.classList.add("neon-btn", "bulma-control-mixin", ("swap-" + index));
        element.innerText = "SWAP CARD";
        return element;
    }

    #reset() {
        this.loadCards();
        // Re-enable buttons
        this.generateSwapButtons();
        for (let i = 0; i < this.footers.length; i++) {
            this.#checkBoxes[i].checked = false;
        }

        this.swapButtons = this.container.getElementsByClassName("bulma-control-mixin");
        for (let i = 0; i < this.swapButtons.length; i++) {
            this.setSwapButton(this.swapButtons[i], this.cardContainers[i]);
        }
    }

    // Add additional functions to manipulate the information within a Container
};

// Container for each card which contains a playing card and exercise content
class CardContainer { // TODO: Refactor to move swap to Class Container
    //
    constructor(containerElement) {
        this.container = containerElement; // Container HTML
        this.id = containerElement.id; // id=card-#

        this.cardImage = containerElement.getElementsByClassName("card-image")[0];
        this.cardContent = containerElement.getElementsByClassName("card-content")[0];

        this.card = new Card(this.cardImage.id, this.cardImage.src);
        this.exercise;
        }

    // TODO: Create DeckOfCards pile and add this card to a pile for tracking
    async loadCard(card) {
        this.card = card;
        // FIXME: Card html briefly flashes due to changing the image element
        this.cardImage.setHTML(this.card.getImgElement().outerHTML);
        await this.#loadExercise();
    }
    
    async #loadExercise() {
        this.exercise = new Exercise();
        let muscle = Exercise.getMuscle(this.card.suit);
        let exerciseType = Exercise.getExerciseTypeByMuscle(muscle);
        let exerciseList = await this.exercise.getExercisesByPrimaryMuscle(muscle);
        Object.assign(this.exercise, exerciseList[randomInt(exerciseList.length)]);

        // TODO: Change to DOM getElements methods by searching either class or id
        // Update Exercise Information in DOM
        this.cardContent.children[0].innerText = "";
        this.cardContent.children[0].appendChild(this.exercise.getExerciseElement());
        this.cardContent.children[1].innerText = exerciseType;
    }
};

/* VARIABLE DECLARATION */
var timerText = document.getElementById("timerText");
var startBtn = document.getElementById("timerStart");
var pastWorkouts = (JSON.parse(localStorage.getItem("workouts")) || []);
var pastWorkoutEl = document.querySelector(".modal-card-body");

// make a past workout object to store in local storage
function storeExcerciseNames(timerText) {
    var excerciseNameText = document.querySelectorAll("a");
    var excerciseList = []
    var currentDate = moment().format("L LT")
    var workoutData = {
        date: currentDate,
        excercises: excerciseList,
        timerStatus: timerText.innerHTML,
    }
    for (var i = 0; i < excerciseNameText.length; i++) {
        excerciseList.push(excerciseNameText[i].innerText)
    }
    pastWorkouts.push(workoutData)
    updatePastWorkouts(workoutData)
}

function updatePastWorkouts(workoutData) {
    var accordianBtn = document.createElement("button");
    accordianBtn.setAttribute("class", "accordion");
    accordianBtn.innerText = workoutData.date
    pastWorkoutEl.appendChild(accordianBtn)

    var panelEl = document.createElement("div");
    panelEl.setAttribute("class", "panel");
    pastWorkoutEl.appendChild(panelEl)

    var dataList = document.createElement("ul");
    panelEl.appendChild(dataList);

    var lifts = document.createElement("li")
    lifts.innerText = workoutData.excercises;
    dataList.appendChild(lifts);

    var timeToComplete = document.createElement("li");
    timeToComplete.innerText = workoutData.timerStatus + " seconds"
    dataList.appendChild(timeToComplete);
    //test
    accordianBtn.addEventListener("click", function () {
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
    // activateAccordion();
}

function renderPastWorkouts(){
    var loadedWorkouts = localStorage.getItem("workouts");

    if (loadedWorkouts === null) {
        return;
    }

    loadedWorkouts = JSON.parse(loadedWorkouts);

    for (var i = 0; i < loadedWorkouts.length; i++){
        var newAccordionBtn = document.createElement("button");
        newAccordionBtn.setAttribute("class", "accordion");
        newAccordionBtn.innerText = loadedWorkouts[i].date;
        pastWorkoutEl.appendChild(newAccordionBtn);

        var newPanelEl = document.createElement("div");
        newPanelEl.setAttribute("class", "panel");
        pastWorkoutEl.appendChild(newPanelEl);

        var newDataList = document.createElement("ul");
        newPanelEl.appendChild(newDataList);

        var newLifts = document.createElement("li")
        var excercisesString = loadedWorkouts[i].excercises.toString();
        newLifts.innerText = excercisesString;
        newDataList.appendChild(newLifts);

        var newTimeToComplete = document.createElement("li");
        newTimeToComplete.innerText = loadedWorkouts[i].timerStatus + " seconds"
        newDataList.appendChild(newTimeToComplete);
        //test
        newAccordionBtn.addEventListener("click", function () {
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
    // activateAccordion();
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

function removeSpacesFromString(stringInput) {
    let words = stringInput.split(" ");
    let newWords = [];
    for (let i = 0; i < words.length; i++) {
        newWords.push(words[i].toLowerCase());
    }
    return newWords.join("-");
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
document.addEventListener("DOMContentLoaded", () => {
    // Functions to open and close a modal
    function openModal($el) {
        $el.classList.add("is-active");
    }

    function closeModal($el) {
        $el.classList.remove("is-active");
    }

    function closeAllModals() {
        (document.querySelectorAll(".modal") || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener("click", () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button") || []).forEach(($close) => {
        const $target = $close.closest(".modal");

        $close.addEventListener("click", () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener("keydown", (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});

var acc = document.getElementsByClassName("accordion");

for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        let acc = document.getElementsByClassName("accordion");

        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                /* Toggle between adding and removing the "active" class,
                to highlight the button that controls the panel */
                this.classList.toggle("active");
                /* Toggle between hiding and showing the active panel */
                var panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    let panel = this.nextElementSibling;
                    if (panel.style.display === "block") {
                        panel.style.display = "none";
                    } else {
                        panel.style.display = "block";
                    }
                }
            });
        }
    });
}

// END MODAL JS CODE

/* MAIN CODE EXECUTION AREA */
function main() {
    window.onload = renderPastWorkouts();
    let exerciseDeck = new DeckOfCards();
    let workout = new Container(document.getElementsByClassName("flipping-cards")[0]);
    workout.setDeck(exerciseDeck);
    // On page load, set the cards and exercises.
    workout.loadCards();
    let timer = new Timer(); // Automatically generates an event listener on page load through class initialization
    workout.setTimer(timer);

    // Add event listeners
    document.getElementById("rulesBtn").addEventListener("click", rulesButtonFunction);

    //TODO: User cannot flip cards until all cards have been loaded! Move javascript src file to top of index.html?
}

main();

//workout.cardContainers[i].card.value;