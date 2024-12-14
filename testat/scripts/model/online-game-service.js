import { Utils } from '../utils/utils.js';

export class OnlineGameService {
    static DELAY_MS = 500;
    async getRankings() {
        try {
            const response = await fetch('https://stone.sifs0005.infs.ch/statistics');
            const data = await response.json();
            const players = Object.values(data).map(player => ({
                user: player.user,
                wins: player.win
            }));

            // Sort players by wins in descending order
            players.sort((a, b) => b.wins - a.wins);

            // Create ranking array
            const rankingArray = [];
            let currentRank = 1;
            let currentWins = players[0].wins;
            let currentPlayers = [];

            players.forEach(player => {
                if (player.wins !== currentWins) {
                    rankingArray.push({
                        rank: currentRank,
                        wins: currentWins,
                        players: currentPlayers
                    });
                    currentRank = rankingArray.length + 1;
                    currentWins = player.wins;
                    currentPlayers = [];
                }
                currentPlayers.push(player.user);
            });

            // Push the last group
            rankingArray.push({
                rank: currentRank,
                wins: currentWins,
                players: currentPlayers
            });

            return rankingArray.slice(0, 10);
        } catch (error) {
            //console.error('Error fetching rankings:', error);
            return [];
        }
    }

    async evaluate(playerName, playerHand, fnUpdateHistory, fnUpdateComputerChoice) {
        try {
            // Capitalize playerHand
            const capitalizedPlayerHand = playerHand.charAt(0).toUpperCase() + playerHand.slice(1).toLowerCase();

            const response = await fetch(`https://stone.sifs0005.infs.ch/play?playerName=${playerName}&playerHand=${capitalizedPlayerHand}&mode=spock`);
            const result = await response.json();
            if (result.choice) {
                fnUpdateComputerChoice(result.choice);
                await Utils.wait(OnlineGameService.DELAY_MS); // emulate async
            }
            let playerResult;
            if (result.win) {
                playerResult = 1;
            } else if (result.win === false) {
                playerResult = -1;
            } else {
                playerResult = 0;
            }
            fnUpdateHistory(playerName, playerHand, result.choice, playerResult);
            return playerResult;
        } catch (error) {
            //console.error('Error evaluating game:', error);
            return { choice: null, win: false };
        }
    }
}
