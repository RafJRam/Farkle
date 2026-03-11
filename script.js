'use strict';

let gameStart = false;
let playerCount = 2;
let scores = [];
let runningScore = 0;
let currentPlayer = 0;
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

// Dynamic game button logic
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
    playerCount = counterBox.querySelector("input").value;
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
    gameStart = false;
    playerCount = 2;
    scores = [];
    runningScore = 0;
    currentPlayer = 0;
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

// populate players container with divs based on playerCount
function populatePlayers(count) {
    
    for (let i = 0; i < count; i++) {
        // Player div with label
        const playerDiv = document.createElement('div');
        playerDiv.id = `player${i}`;
        playerDiv.innerHTML = `I'm player ${i+1}!`;

        // Player score in player div
        const playerScore = document.createElement('div');
        playerScore.innerHTML = 'Score: 0 <br><br>';
        playerDiv.appendChild(playerScore);

        // each player is now contained within 1 div
        playerContainer.appendChild(playerDiv);
    }
    scores = Array(playerCount).fill(0);
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
    // Acquire current player div, change background color, and append buttons to div
    currDiv = document.getElementById(`player${currPlayer}`);
    currDiv.style.backgroundColor = '#951212';
    currDiv.appendChild(rollButton);
    currDiv.appendChild(passButton);

    // Player cannot pass on first turn until they reach running score 500

}

// Rolls a batch of dice and returns result in an array
function RollDice(numDice) {
    // rolls single dice
    const roll = () => Math.floor(Math.random() * 6) + 1;

    // returns array of rolls based on numDice
    // filled with 0s and replaced with rolls
    return Array(numDice).fill(0).map(roll);
}

// roll button event
rollButton.addEventListener('click', function () {
    console.log("Roll button clicked");
    
});

// pass button event
passButton.addEventListener('click', function () {
    
    /* SCORING */
    scores[currentPlayer] += runningScore;
    runningScore = 0;
    
    // If current player is last player, end game and determine winner
    if (currentPlayer == lastPlayer) {
        const winner = scores.indexOf(Math.max(...scores)) + 1;
        console.log(`Game over! Player ${winner} wins!`);
        
        return;
    }
    
    /* POST SCORING */
    // update player score in player div
    const scoreDiv = currDiv.querySelector('div');
    scoreDiv.innerHTML = `Score: ${scores[currentPlayer]} <br><br>`;

    // Determine final player to exit game loop
    if (scores[currentPlayer] >= 3000) {
        // last player will be the previous player, but if current player is player 0, final player will be the rightmost player
        lastPlayer = currentPlayer == 0 ? playerCount - 1 : currentPlayer - 1;
    }
    
    // revert background
    currDiv.style.backgroundColor = '#FFFFFF';
    // remove button elements
    rollButton.remove();
    passButton.remove();
    
    // increment turn to next player
    const nextPlayer = currentPlayer == playerCount - 1 ? 0 : currentPlayer + 1;
    currentPlayer = nextPlayer;    
    playerTurn(nextPlayer);
});

