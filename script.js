'use strict';

let gameStart = false;
let playerCount = 2;
let scores = [];

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

// Start button to finalize playerCount and start game
document.querySelector('.start').addEventListener('click',
    function() {
        if (gameStart) return
        gameStart = true;
        populatePlayers();
        playGame();
    }
)

// populate players container with divs based on playerCount
function populatePlayers() {
    const playersContainer = document.getElementById('player-container');
    
    for (let i = 1; i <= playerCount; i++) {
        // Player div with label
        const playerDiv = document.createElement('div');
        playerDiv.id = `player${i}`;
        playerDiv.innerHTML = `I'm player ${i}!`;

        // Player score in player div
        const playerScore = document.createElement('div');
        playerScore.innerHTML = 'Score: 0 <br><br>';
        playerDiv.appendChild(playerScore);

        // each player is now contained within 1 div
        playersContainer.appendChild(playerDiv);
    }
    scores = Array(playerCount).fill(0);
}


setPlayerCount(document.querySelector('.counter-box'), 2, 8);

// Gameplay
function playGame() {
    document.querySelector('.roll').addEventListener('click', function () {
    
    })
    
    let currentPlayer = 1;
    let lastPlayer = null;

    // loop occurs for each player
    while (currentPlayer != lastPlayer) {
        
        // Aqcuire current player div
        const currDiv = document.getElementById(`player${currentPlayer}`);
        
        currDiv.style.backgroundColor = '#951212';
        // Action buttons in player div
        const rollButton = document.createElement('button');
        rollButton.innerHTML = "Roll!"
        rollButton.classList.add('roll');
        currDiv.appendChild(rollButton);
        
        const passButton = document.createElement('button');
        passButton.innerHTML = "Pass!"
        passButton.classList.add('pass');
        currDiv.appendChild(passButton);

        let runningScore = 0;
        
        /* SCORING */

        scores[currentPlayer] += runningScore;
        
        /* POST SCORING */
        // Determine final player to exit game loop
        if (scores[currentPlayer] >= 10000) {
            lastPlayer = currentPlayer == 1 ? playerCount : currentPlayer - 1;
        }

        // revert background
        currDiv.style.backgroundColor = '#FFFFFFF';
        // remove button elements
        rollButton.remove();
        passButton.remove();

        // increment turn to next player
        currentPlayer = currentPlayer == playerCount ? 1 : currentPlayer + 1;

    }

}
