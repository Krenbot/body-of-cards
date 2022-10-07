function Card(cardCode, image, images, value, suit) {
    this.code = cardCode,
    this.image = image,
    this.images = images,
    this.value = value,
    this.suit = suit

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
        var cards = [];

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
                    var tempCard = new Card(result.cards[i].code, result.cards[i].image, result.cards[i].images, result.cards[i].value, result.cards[i].suit);
                    cards.push(tempCard);
                }
                deck.id = result.deck_id;
                deck.remaining = result.remaining;
            })

        return cards;
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
console.log(testObj.draw(5));