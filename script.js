function Card(cardCode, image, images, value, suit) {
    this.code = "",
    this.image = "",
    this.images = "",
    this.value = "",
    this.suit = ""

    // TODO: Add any methods needed for card manipulation
}

// Deck of Cards Object to be use the API.
function DeckOfCards(number = 1) {
    this.baseURL = new URL("https://deckofcardsapi.com/api/deck/"),
    this.id = "",
    this.shuffled = "",
    this.remaining = "",

    this.shuffle = function() {
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
    },

    this.draw = function(count = 1) {
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
                console.log(result);
            })
    },

    this.newDeck = function(addJokers = false) {
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
        this.shuffle();
    },

    this.returnToDeck = function() {

    }
};

var testObj = new DeckOfCards();
//testObj.newDeck(true);
testObj.draw();
console.log(testObj);