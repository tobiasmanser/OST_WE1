import { gameService } from './model/game-service.js';

const rankingsTable = document.querySelector('#ranking-table tbody');
const choiceButtons = document.querySelectorAll('#choices button');
const switchButton = document.querySelector('#mode-switch');
const historyTable = document.querySelector('#history-table tbody');
const computerChoiceField = document.querySelector('#computer-choice-field');
const computerChoiceBox = document.querySelector('#computer-choice');
const startButton = document.querySelector('#start-game');
const nameInputField = document.querySelector('#player-name');
const gameSection = document.querySelectorAll('.game');
const startScreen = document.querySelectorAll('.start-screen');
const backButton = document.querySelector('#back-button');
const greetingField = document.querySelector('#greeting');

let name;

async function updateRankingsTable() {
    const rankings = await gameService.getRankings();
    rankingsTable.innerHTML = '';
    rankings.forEach(r => {
        const row = rankingsTable.insertRow(-1);
        row.insertCell(0).textContent = r.rank;
        row.insertCell(1).textContent = r.wins;
        row.insertCell(2).textContent = r.players.join(', ');
    });
}

function switchMode() {
    gameService.isOnline = !gameService.isOnline;
    updateRankingsTable();
    return gameService.isOnline ? 'Local' : 'Server';
}

function startGame() {
    name = nameInputField.value;
    if (!name || name.trim() === '') {
        // alert('Please enter your name');
        return;
    }
    name = name.trim();
    greetingField.textContent = `Hello, ${name}!`;
    startScreen.forEach(s => s.classList.add('hidden'));
    gameSection.forEach(s => s.classList.remove('hidden'));
}

switchButton.addEventListener('click', () => {
    switchButton.textContent = `Switch to ${switchMode()} Mode`;
});

startButton.addEventListener('click', startGame);

function disableButtons(value) {
    choiceButtons.forEach(button => {
        button.disabled = value;
    });
}

function getResultIcon(result) {
    if (result === 1) {
        return '✔️';
    } 
    if (result === -1) {
        return '❌';
    }
    return '🤝'; 
}

function updateHistory(player, playerHand, systemHand, result) {
    const row = historyTable.insertRow(-1);
    row.insertCell(0).textContent = playerHand;
    row.insertCell(1).textContent = systemHand;
    row.insertCell(2).textContent = getResultIcon(result);
}

function updateComputerChoice(hand) {
    computerChoiceField.textContent = hand;
}

function resetButtons() {
    choiceButtons.forEach(button => {
        button.classList.remove('win', 'lose', 'draw');
    });
}

function resetComputerChoiceBox() {
    computerChoiceBox.classList.remove('win', 'lose', 'draw');
}

async function makeChoice(button) {
    resetButtons();
    resetComputerChoiceBox();
    disableButtons(true);
    
    // Evaluate the game result
    const result = await gameService.evaluate(name, button.dataset.choice, updateHistory, updateComputerChoice);

    // Add the appropriate class to the button based on the result
    if (result === 1) {
        button.classList.add('win');
        computerChoiceBox.classList.add('lose');
    } else if (result === -1) {
        button.classList.add('lose');
        computerChoiceBox.classList.add('win');
    } else {
        button.classList.add('draw');
        computerChoiceBox.classList.add('draw');
    }

    // Re-enable buttons after the choices and updates
    disableButtons(false);

    
    updateRankingsTable();
}

choiceButtons.forEach(button => {
    button.addEventListener('click', async () => {
        makeChoice(button)
    });
})

backButton.addEventListener('click', () => {
    gameSection.forEach(s => s.classList.add('hidden'));
    startScreen.forEach(s => s.classList.remove('hidden'));
    resetButtons();
    resetComputerChoiceBox();
    nameInputField.value = '';
    computerChoiceField.textContent = '-';
    name = '';
});

updateRankingsTable();
