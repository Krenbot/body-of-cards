// Deck of Cards Object to be use the API.
function DeckOfCards(number = 1) {
    this.baseURL = "https://deckofcardsapi.com/api/deck/",
    this.id = "",
    this.shuffled = "",
    this.remaining = "",

    this.shuffle = function() {

    },

    this.draw = function() {

    },

    this.newDeck = function(addJokers = false) {
        var url = this.baseURL + "new/";
        const fetchHeader = new Headers();
        const fetchOptions = {
            method: "GET",
            headers: fetchHeader,
            cache: "default",
        }

        if (addJokers) {
            fetchHeader.append("jokers_enabled", "true");
        }

        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((result) => console.log(result))

    },

    this.returnToDeck = function() {

    }
};

var testObj = new DeckOfCards();
testObj.newDeck();