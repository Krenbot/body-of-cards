// Deck of Cards Object to be use the API.
function DeckOfCards(number = 1) {
    this.baseURL = new URL("https://deckofcardsapi.com/api/deck/"),
    this.id = "",
    this.shuffled = "",
    this.remaining = "",

    this.shuffle = function() {

    },

    this.draw = function() {

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
testObj.newDeck(true);
console.log(testObj);