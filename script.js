// Deck of Cards Object to be use the API.
function DeckOfCards(number = 1) {
    this.baseURL = "https://deckofcardsapi.com/api/deck",
    this.id = "",
    this.shuffled = "",
    this.remaining = "",

    this.shuffle = function() {

    },

    this.draw = function() {

    },

    this.newDeck = function(addJokers = false) {
        var url = this.baseURL + "new/";
        if (addJokers) {
            const fetchOptions = {
                method: "GET",
                headers: {
                    "jokers_enabled": "true"
                },
            }
        }

        fetch(url, fetchOptions)
            .then((response) => response.json())
            .then((result) => console.log())

    },

    this.returnToDeck = function() {

    }
};