class Card {
    constructor(cardCode, image, images, value, suit) {
        this.code = cardCode;
        this.image = image;
        this.images = images;
        this.value = value;
        this.suit = suit;
    }

    viewCard() {
        var img = document.createElement("img");
        img.src = this.image;
        img.alt = this.value + " of " + this.suit;
    }

    // TODO: Add any methods needed for card manipulation
}

// Deck of Cards Object to be use the API.
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
        this.workoutType = "";
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
        this.resetURL();

        this.baseURL.searchParams.append("name", exercise);

        await fetch(this.baseURL.href, Exercise.fetchOptions)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    async getExerciseByPrimaryMuscle(pMuscle) {
        this.resetURL();

        this.baseURL.searchParams.append("primaryMuscle", pMuscle);

        await fetch(this.baseURL.href, Exercise.fetchOptions)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

    async getExerciseBySecondaryMuscle(sMuscle) {
        this.resetURL();

        this.baseURL.searchParams.append("secondaryMuscle", sMuscle);

        await fetch(this.baseURL.href, Exercise.fetchOptions)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
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

startBtn.addEventListener("click", startTimer);

// DEV TESTING SECTION
var testObj = new DeckOfCards();
testObj.getCards(5);

var testObj2 = new Exercise();
//testObj2.getAllMuscles();