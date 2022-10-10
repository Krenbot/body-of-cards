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
        this.cards = [];
        this.decks = number;
    }

    shuffle() {
        // TODO: Implement functionality for multiple decks
        var deck = this;
        var url = this.baseURL;
        if (url.id === "") {
            url.pathname += "new/shuffle/?deck_count=1";
        } else {
            url.pathname += this.id + "/shuffle/";
        }

        fetch(url.href)
            .then((response) => response.json())
            .then((result) => {
                deck.id = result.deck_id;
                deck.shuffled = result.shuffled;
            })
    }

    draw(count = 1) {
        var deck = this;
        var url = this.baseURL;

        if (deck.id === "") {
            url.pathname += "new/draw/";
        } else {
            url.pathname += this.id + "/draw/";
        }
        url.searchParams.append("count", count);

        fetch(url.href)
            .then((response) => response.json())
            .then((result) => {
                for (var i = 0; i < result.cards.length; i++) {
                    var temp = new Card(result.cards[i].code, 
                        result.cards[i].image, result.cards[i].images, 
                        result.cards[i].value, result.cards[i].suit);
                    
                    deck.cards.push(temp);
                }
                deck.id = result.deck_id;
                deck.remaining = result.remaining;
                deck.renderDeck();
                // TODO: Either change this method to use async and await, or find a way to prevent downstream methods from trying to access data until the fetch is complete.
            })
    }

    newDeck(addJokers = false) {
        // TODO: Implement functionality for multiple decks
        var deck = this;
        var url = this.baseURL;
        url.pathname = url.pathname + "new/";
        if (addJokers) {
            url.searchParams.append("jokers_enabled", "true");
        }

        fetch(url.href)
            .then((response) => response.json())
            .then((result) => {
                deck.id = result.deck_id;
                deck.shuffled = result.shuffled;
                deck.remaining = result.remaining;
            })
        // TODO: Rather than call the shuffle method, add a method parameter to call https://deckofcardsapi.com/api/deck/new/shuffle/ from this method?
        this.shuffle();
    }

    returnToDeck() {
        // TODO: Implement method for returning cards to the deck API. May not be needed for the MVP
    }

    // Test function for now. draw requires sometime to load the cards from the data fetch.
    // Calling this methods allows the user to test the renderDeck method if it is called from draw.
    renderDeck() {
        console.log(this.cards);
        console.log(this.cards[0]);
    }

    // TODO: Implement simple instructions for using the DeckOfCards Class
    // TODO: Add comments explaining the why's of each method
};

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
//testObj.newDeck(true);
var testObj = new DeckOfCards();
testObj.draw(10);