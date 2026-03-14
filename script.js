'use strict';

// per game
let gameStart = false;
let playerCount = 2;
let scores = [];

// per player
let currentPlayer = 0;
let runningScore = 0;

// dice values per player
let numRemaining = 6;
let rolledDice = Array(6).fill(0);
let savedDice = Array(6).fill(0);
let lastPlayer = null;

// gameBtn is start or reset button
const gameBtn = document.querySelector(".start-btn");
const playerContainer = document.querySelector('#player-container');
const counterBox = document.querySelector(".counter-box");

// sets player count before game starts
function setPlayerCount(node, min, max) {

    const input = node.querySelector("input");
    const minusBtn = node.querySelector(".minus-btn");
    const plusBtn = node.querySelector(".plus-btn");
    
    // initial value
    input.value = playerCount;

    // Counter buttons persist until user clicks "Start game" btn
    minusBtn.addEventListener('click', function () {
        if (gameStart) return;

        input.value = (playerCount-1) < min ? min : (playerCount-1);
        playerCount = Number(input.value);
    });

    plusBtn.addEventListener('click', function () {
        if (gameStart) return;
        
        input.value = (playerCount+1) > max ? max : (playerCount+1);
        playerCount = Number(input.value);        
    });

}
setPlayerCount(document.querySelector('.counter-box'), 2, 8);

// populate players container with divs based on playerCount
function populatePlayers(count) {
    
    for (let i = 0; i < count; i++) {
        // Player div with label
        const playerDiv = document.createElement('div');
        playerDiv.id = `player${i}`;
        playerDiv.innerHTML = `Player ${i+1}`;

        // Player score in player div
        const playerScore = document.createElement('div');
        playerScore.innerHTML = 'Score: 0 <br><br>';
        playerDiv.appendChild(playerScore);

        // each player is now contained within 1 div
        playerContainer.appendChild(playerDiv);
    }
    scores = Array(playerCount).fill(0);
}

// Game button logic based on what state 
gameBtn.addEventListener('click', function() {
    if (!gameStart) {
        startGame();
    } else {
        resetGame();
    }
});

// Start button to populate player divs and start first player's turn
function startGame() {
    gameStart = true;

    // remove Player Counter div
    playerCount = Number(counterBox.querySelector("input").value);
    counterBox.remove();

    // start button becomes reset button
    gameBtn.className = "reset-btn";
    gameBtn.innerHTML = "Reset!";

    // populate player container with divs based on playerCount and start first player's turn
    populatePlayers(playerCount);
    playerTurn(currentPlayer);
}

/* Reset function after start is clicked */
function resetGame() {
    // reset to starting game state
    // per game
    gameStart = false;
    playerCount = 2;
    scores = [];

    // per player
    currentPlayer = 0;
    runningScore = 0;

    // dice values per player
    numRemaining = 6;
    rolledDice = Array(6);
    savedDice = Array(6);
    lastPlayer = null;

    // Empty contents of player-container
    playerContainer.replaceChildren();

    // Reload counter container
    document.body.appendChild(counterBox);
    counterBox.value = playerCount;
    counterBox.querySelector("input").value = playerCount;

    // Reload player-container
    document.body.appendChild(playerContainer);

    // Convert reset back to start button
    gameBtn.className = "start-btn";
    gameBtn.innerHTML = "Start Game!";
    
    console.log("Game reset!");
    return;
}

// Globally track current player div for listeners to manipulate
let currDiv = null;

// Roll button
const rollButton = document.createElement('button');
rollButton.innerHTML = "Roll!";
rollButton.classList.add('roll');

// Pass button
const passButton = document.createElement('button');
passButton.innerHTML = "Pass!";
passButton.classList.add('pass');

// Each player's turn
function playerTurn(currPlayer) {
    console.log(`currPlayer: ${currPlayer}`);
    
    // Acquire current player div, change background color
    currDiv = document.getElementById(`player${currPlayer}`);
    currDiv.style.backgroundColor = '#951212';

    // Add dice container
    const diceDiv = document.createElement("div");
    diceDiv.classList.add("dice-container");
    diceDiv.id = "dice-container";

    // Split dice container into rolled pile and scored pile divs
    const rolledDiv = document.createElement("div");
    const savedDiv = document.createElement("div");

    rolledDiv.classList.add("rolled-div");
    savedDiv.classList.add("saved-div");

    rolledDiv.id = "rolled-div";
    savedDiv.id = "saved-div";

    diceDiv.append(rolledDiv, savedDiv);

    // Append dice div then action buttons
    currDiv.appendChild(diceDiv);
    currDiv.appendChild(rollButton);
    currDiv.appendChild(passButton);

    // Player cannot pass on first turn until they reach running score 500

}

// Rolls a batch of dice and returns result in an array
function rollDice(numDice) {

    console.log("numdice: " + numDice);
    
    // rolls single dice
    const roll = () => Math.floor(Math.random() * 6) + 1;

    // returns array of rolls based on numDice
    // filled with 0s and replaced with rolls
    return Array(numDice).fill(0).map(roll);
}

// Scores dice roll based on combo priority
// Multiple scores can be added, process all die until no scoring possible
// Here, what goes into savedDice is decided, and remaining dice is calculated
/**
 * Two triples = 2,500
 * Four of a kind + pair = 1,500
 * Three pairs = 1,500
 * 1-6 straight = 1,500
 * Six of a kind = 3,000
 * Five of a kind = 2,000
 * Four of a kind = 1,000
 * 3 of a kind = X00 where X is the number there's 3 of
 * Single 5 = 50
 * Single 1 = 100
 */
function transferDice() {

}

function scoreDice(diceValues) {

    let diceCounts = new Map();
    let transferCount = 0;
    let score = 0;

    diceValues.forEach(num => {
        diceCounts.set(num, (diceCounts.get(num) || 0) + 1);
    });

    // Two triples = 2,500
    if ([...diceCounts.values] == [3, 3]) {
        console.log("two triples");
        transferCount = 6;
        score = 2500;
    } // Four of a kind + pair = 1,500 
    else if ([...diceCounts.values] == [4, 2]) {
        console.log("4 of a kind + pair");
        transferCount = 6;
        score = 1500;
    } // Three pairs 
    else if ([...diceCounts.values] == [2, 2, 2]) {
        console.log("3 pairs");
        transferCount = 6;
        score = 1500;
    } // 1-6 straight
    else if ([...diceCounts.values] == [1, 1, 1, 1, 1, 1]){
        console.log("1-6 straight");
        transferCount = 6;
        score = 1500;

    } // Six of a kind
    else if ([...diceCounts.values] == [6]) {
        console.log("Six of a kind");
        transferCount = 6;
        score = 3000;
    }
    // TODO FINISH scoring

    // this number is how many dice will score, HARDCODED rn
    const gap = 2;    

    // saved amount before adding more to savedDice
    const savedAmount = 6-numRemaining;
    
    // subarray of rollDice to swap to savedDice
    const scoringDice = rolledDice.slice(numRemaining-gap, numRemaining);
    
    // replace subarray with gap 0s
    rolledDice.splice(numRemaining-gap, gap, ...Array(gap).fill(0));

    /* replace first X dice starting at i=savedAmount, X being gap,
    with scoringDice*/

    savedDice.splice(savedAmount, gap, ...scoringDice);
    
    numRemaining -= gap;

    return totalScore;
}

function renderDice(rolled, saved) {
    const rolledDiv = document.getElementById("rolled-div");
    const savedDiv = document.getElementById("saved-div");

    rolled.forEach(
        num => {
            if (num != 0) {
                const newDice = document.createElement("div");
                newDice.className = "face";
                newDice.id = `face${num}`;

                for (let i = 0; i < num; i++) {
                    const pipSpan = document.createElement("span");
                    pipSpan.className = "pip";
                    newDice.appendChild(pipSpan);
                }

                rolledDiv.appendChild(newDice);
            }
        }
    );

    saved.forEach(
        num => {
            if (num != 0) {
                const newDice = document.createElement("div");
                newDice.className = "face";
                newDice.id = `face${num}`;

                for (let i = 0; i < num; i++) {
                    const pipSpan = document.createElement("span");
                    pipSpan.className = "pip";
                    newDice.appendChild(pipSpan);
                }

                savedDiv.appendChild(newDice);
            }
        }
    );
}

// roll button event
rollButton.addEventListener('click', function () {
    if (!gameStart) return;
    // clear all dice before re-rolling
    const rolledDiv = document.getElementById("rolled-div");
    const savedDiv = document.getElementById("saved-div");

    rolledDiv.replaceChildren();
    savedDiv.replaceChildren();

    if (runningScore == 0) { // initial full roll
        rolledDice = rollDice(6);
    }
    else { // every subsequent roll
 
        // savedDice has 6 dice
        if (numRemaining == 0) {
            numRemaining = 6;

            console.log('full re-roll');
            
            // flush savedDice and fully re-roll
            savedDice = Array(6).fill(0);
            rolledDice = rollDice(6);   
        }
        else {
            // Replaces the first X numbers with new roll, X = numRemaining  
            // rolledDice = [[new role replacing]+[saved dice length of 0s]]
            rolledDice.splice(0, numRemaining, ...rollDice(numRemaining));
        }
    }

    // before scoring
    console.log("Before scoring");
    console.log(rolledDice);
    console.log(savedDice);

    // pass in subarray of dice that got replaced/rolled first time
    // add to running score
    runningScore += scoreDice(rolledDice.slice(0, numRemaining));

    // after scoring

    renderDice(rolledDice, savedDice);

    console.log("After scoring");
    console.log(rolledDice);
    console.log(savedDice);
    console.log(runningScore);
    
});

// pass button event
passButton.addEventListener('click', function () {
    if (!gameStart) return;
    
    // Empty rolled and saved arrays
    numRemaining = 6;
    rolledDice.fill(0);
    savedDice.fill(0);

    console.log(`runningScore about to be added to ${scores[currentPlayer]}: ${runningScore}`);
    
    /* SCORING */
    scores[currentPlayer] += runningScore;
    runningScore = 0;
    
    // If current player is last player, end game and determine winner
    if (currentPlayer == lastPlayer) {
        const winner = scores.indexOf(Math.max(...scores));
        gameStart = false;
        console.log(`Game over! Player ${winner} wins!`);
        
        return;
    }
    
    /* POST SCORING */
    // update player score in player div
    const scoreDiv = currDiv.querySelector('div');
    scoreDiv.innerHTML = `Score: ${scores[currentPlayer]} <br><br>`;

    // Determine final player to exit game loop
    if (scores[currentPlayer] >= 3000 && lastPlayer == null) {
        // last player will be the previous player, but if current player is player 0, final player will be the rightmost player
        lastPlayer = currentPlayer == 0 ? playerCount - 1 : currentPlayer - 1;
        console.log(`lastPlayer: ${lastPlayer}`);
        
    }
    
    // revert background
    currDiv.style.backgroundColor = '#FFFFFF';

    // remove dice container
    document.getElementById('dice-container').remove();

    // remove button elements
    rollButton.remove();
    passButton.remove();
    
    // increment turn to next player
    currentPlayer = currentPlayer == playerCount - 1 ? 0 : currentPlayer + 1;    
    playerTurn(currentPlayer);
});

