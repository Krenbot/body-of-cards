var timerText = document.getElementById("timerText")
var startBtn = document.getElementById("timerStart")
var timerStatus = "new"
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
var interval
function startTimer(){
    if (timerStatus === "new"){
        var timerCount = 0
        timerText.innerHTML = 0
        timerStatus = "running"
        startBtn.innerHTML = "Stop"
        interval = setInterval(function(){
            timerCount++
            timerText.innerHTML = timerCount
        }, 1000);
    } else if (timerStatus === "running"){
        timerStatus = "stopped"
        startBtn.innerHTML = "Reset"
        clearInterval(interval)
        interval = null
        console.log("Help")
    } else if (timerStatus === "stopped"){
        timerStatus = "new"
        startBtn.innerHTML = "Start Timer"
        var timerCount = 0
        timerText.innerHTML = ""
        console.log("Help2")
    }
}

startBtn.addEventListener("click", startTimer)
