// Cards Class to represent each card pulled from the Deck of Cards API
class Card {
    #imgTag; // private member variable

    constructor(cardCode, image, images, value, suit) {
        this.code = cardCode;
        this.image = image;
        this.images = images;
        this.value = value;
        this.suit = suit;
    }

    getImgTag() {
        if (this.#imgTag === "") {
            this.createImgTag();
        }
        return this.#imgTag;
    }

    createImgTag() {
        // TODO: Refactor to pass appropriate image element for HTML purposes.
        var img = document.createElement("img");
        img.src = this.image;
        img.alt = this.value + " of " + this.suit;
        this.#imgTag = img;
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

        var deck = this;
        var url = this.baseURL;
        if (deck.id === "") {
            url.pathname += "new/shuffle/"
            url.searchParams.append("deck_count", 1);
        } else {
            url.pathname += (this.id + "/shuffle/");
        }

        await fetch(url.href)
            .then((response) => response.json())
            .then((result) => {
                deck.id = result.deck_id;
                deck.shuffled = result.shuffled;
            })
    }

    async draw(count = 1) {
        this.resetURL();

        var deck = this;
        var url = this.baseURL;
        var cards = [];

        if (deck.id === "") {
            url.pathname += "new/draw/";
        } else {
            url.pathname += (this.id + "/draw/");
        }
        url.searchParams.append("count", count);

        await fetch(url.href)
            .then((response) => response.json())
            .then((result) => {
                for (var i = 0; i < result.cards.length; i++) {
                    var temp = new Card(result.cards[i].code, 
                        result.cards[i].image, result.cards[i].images, 
                        result.cards[i].value, result.cards[i].suit);
                    
                    cards.push(temp);
                }

                deck.id = result.deck_id;
                deck.remaining = result.remaining;

                localStorage.setItem("draw-latest", JSON.stringify(cards));

                // TODO: Either change this method to use async and await, or find a way to prevent downstream methods from trying to access data until the fetch is complete.
            });

        return cards;
    }

    async newDeck(shuffleBool = 1, addJokers = false) {
        // TODO: Implement functionality for multiple decks
        this.resetURL();

        var deck = this;
        var url = this.baseURL;
        url.pathname = url.pathname + "new/";
        if (addJokers) {
            url.searchParams.append("jokers_enabled", "true");
        }

        await fetch(url.href)
            .then((response) => response.json())
            .then((result) => {
                deck.id = result.deck_id;
                deck.shuffled = result.shuffled;
                deck.remaining = result.remaining;
            })
        // TODO: Rather than call the shuffle method, add a method parameter to call https://deckofcardsapi.com/api/deck/new/shuffle/ from this method?
        this.shuffle();
    }

    async getCards(count) {
        this.shuffle();
        const cardList = await this.draw(count);
        console.log(cardList);

        // TODO: Write cards to html objects. May need to refactor getCards or implement new method to write cards to html.
        // TODO: Remove console.log once cards are written to HTML
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

    // Key below is provided by PBP66 on https://rapidapi.com/
    // Must access by invoking the class instance, not the object instance
    static fetchOptions = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '0198bbaf50msh1011edbb678ad4bp19a4a1jsn246309d212b1',
            'X-RapidAPI-Host': 'exerciseapi3.p.rapidapi.com'
        }
    };

    static allMuscles = ['pectoralis major', 'biceps', 'abdominals', 'sartorius', 'abductors', 'trapezius', 'deltoid', 'latissimus dorsi', 'serratus anterior', 'external oblique', 'brachioradialis', 'finger extensors', 'finger flexors', 'quadriceps', 'hamstrings', 'gastrocnemius', 'soleus', 'infraspinatus', 'teres major', 'triceps', 'gluteus medius', 'gluteus maximus'];

    static allExercises = []; // TODO: Update at a later date once API provides easy access

    resetURL() {
        this.baseURL = new URL("https://exerciseapi3.p.rapidapi.com/search/");
    }

    async getAllMuscles() {
        // Currently does not provide much functionality for the users with card games
        this.resetURL();

        this.baseURL.pathname += "muscles/";
        await fetch(this.baseURL.href, Exercise.fetchOptions)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    async getExerciseByName(exercise) {
        var exercisesData = [];
        var exercises = [];
        this.resetURL();
        this.baseURL.searchParams.append("name", capitalizeEachWord(exercise));

        await fetch(this.baseURL.href, Exercise.fetchOptions)
            .then(response => response.json())
            .then(response => {
                exercisesData = Object.keys(response);
                console.log(exercisesData);
                for (var i = 0; i < exercisesData.length; i++ ) {      
                    var temp = new Exercise();
                    Object.assign(temp, Exercise.convertAPIObject(response[exercisesData[i]]));
                    exercises.push(temp);
                }
                //console.log(exercises);
                //localStorage.setItem("testExercise", JSON.stringify(exercises));
            })
            .catch(err => console.error(err));
    }

    async getExercisesByPrimaryMuscle(pMuscle) {
        this.resetURL();

        this.baseURL.searchParams.append("primaryMuscle", pMuscle);

        await fetch(this.baseURL.href, Exercise.fetchOptions)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    async getExercisesBySecondaryMuscle(sMuscle) {
        this.resetURL();

        this.baseURL.searchParams.append("secondaryMuscle", sMuscle);

        await fetch(this.baseURL.href, Exercise.fetchOptions)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    static convertAPIObject(apiObject) {
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
            delete Object.assign(apiObject, {[properties[i]]: apiObject[oldProperty]})[oldProperty];
        }
        apiObject.video = new URL(apiObject.video);
        return apiObject;
    }
}

var timerText = document.getElementById("timerText");
var startBtn = document.getElementById("timerStart");
var timerStatus = "new";
var interval;

function startTimer(){
    if (timerStatus === "new"){
        var timerCount = 0;
        timerText.innerHTML = 0;
        timerStatus = "running";
        startBtn.innerHTML = "Stop";
        interval = setInterval(function(){
            timerCount++;
            timerText.innerHTML = timerCount;
        }, 1000);
    } else if (timerStatus === "running"){
        timerStatus = "stopped";
        startBtn.innerHTML = "Reset";
        clearInterval(interval);
        interval = null;
        console.log("Help");
    } else if (timerStatus === "stopped"){
        timerStatus = "new";
        startBtn.innerHTML = "Start Timer";
        var timerCount = 0;
        timerText.innerHTML = "";
        console.log("Help2");
    }
}

function capitalizeEachWord(stringInput) {
    var words = stringInput.split(" ");
    var newWords = [];
    for(var i = 0; i < words.length; i++) {
        newWords.push(words[i][0].toUpperCase() + words[i].substring(1));
    }
    return newWords.join(" ");
}

startBtn.addEventListener("click", startTimer);

// DEV TESTING SECTION
var testObj = new DeckOfCards();
testObj.getCards(5);

//Bulma Accordion Script
// var accordions = bulmaAccordion.attach(); // accordions now contains an array of all Accordion instances

var testObj2 = new Exercise();
//testObj2.getExerciseByName("Barbell Bench Press");