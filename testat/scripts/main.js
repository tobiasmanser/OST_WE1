import { gameService } from './model/game-service.js';

// Dummy Code
console.log('isOnline:', gameService.isOnline);

const rankings = await gameService.getRankings();

const choices = document.querySelectorAll('#choices button');
const switchButton = document.querySelector('#mode-switch');
const history = document.querySelector('#history-table tbody');
const computerChoice = document.querySelector('#computer-choice');

let name;

Object.values(rankings).forEach(x=> {
    console.log(JSON.stringify(x));
});

console.log(await gameService.evaluate('Michael', gameService.possibleHands[0]));

function switchMode() {
    gameService.isOnline = !gameService.isOnline;
    console.log('isOnline:', gameService.isOnline);
    return gameService.isOnline ? 'Local' : 'Server';
}

switchButton.addEventListener('click', () => {
    switchButton.textContent = `Switch to ${switchMode()} Mode`;
});


function disableButtons(value) {
    choices.forEach(button => {
        button.disabled = value;
    });
}

function updateHistory(player, playerHand, systemHand, result) {
    const row = history.insertRow(-1);
    row.insertCell(0).textContent = playerHand;
    row.insertCell(1).textContent = systemHand;
    console.log(result);
    row.insertCell(2).textContent = result;
}

function updateComputerChoice(hand) {
    computerChoice.textContent = hand;
}

async function makeChoice(button) {
    disableButtons(true);
    
    // Ensure possibleHands has valid entries and show them in the console
    console.log('Possible Hands:', gameService.possibleHands);

    // Assign systemHand randomly (you can adjust if needed)
    const systemHand = gameService.possibleHands[Math.floor(Math.random() * gameService.possibleHands.length)];
    
    // Log the selected systemHand choice
    console.log('System Hand:', systemHand);

    // Update the visual representation or other related functionality
    updateComputerChoice(systemHand);

    // Evaluate the game result
    const result = await gameService.evaluate('Michael', button.dataset.choice, systemHand);
    
    // Log the result for debugging
    console.log('Game Result:', result);

    // Update the history with the choices and result
    updateHistory('Michael', button.dataset.choice, systemHand, result);

    // Re-enable buttons after the choices and updates
    disableButtons(false);
}

choices.forEach(button => {
    button.addEventListener('click', async () => {
        makeChoice(button)
    });
})
