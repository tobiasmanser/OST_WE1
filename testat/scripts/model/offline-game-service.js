import { Utils } from '../utils/utils.js';

export class OfflineGameService {
    static DELAY_MS = 1000;

    constructor() {
        this.possibleHands = Object.keys(this.#resultLookup);
    }

    // same data structure as server
    #playerState = {
        Markus: {
            user: 'Markus',
            win: 3,
            lost: 6,
        },
        Michael: {
            user: 'Michael',
            win: 3,
            lost: 6,
        },
        Lisa: {
            user: 'Lisa',
            win: 4,
            lost: 5,
        },
    };

    // Can be used to check if the selected hand wins/loses
    // TODO : complete structure
    #resultLookup = {
        rock: {
            rock: 0,
            scissors: 1,
            paper: -1,
            spock: -1,
            lizard: 1,
        },
        scissors: {
            rock: -1,
            scissors: 0,
            paper: 1,
            spock: -1,
            lizard: 1,
        },
        paper: {
            rock: 1,
            scissors: -1,
            paper: 0,
            spock: 1,
            lizard: -1,
        },
        spock: {
            rock: 1,
            scissors: 1,
            paper: -1,
            spock: 0,
            lizard: -1,
        },
        lizard: {
            rock: -1,
            scissors: -1,
            paper: 1,
            spock: 1,
            lizard: 0,
        }
    };

    async getRankings() { 
        // Check if playerState is defined
        if (!this.#playerState) {
            throw new Error("playerState is not defined");
        }
    
        // Extract players and their win counts
        const players = Object.values(this.#playerState).map(player => ({
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
    }

    async evaluate(playerName, playerHand, fnUpdateHistory, fnUpdateComputerChoice) {
        // Assign systemHand randomly (you can adjust if needed)
        const systemHand = this.possibleHands[Math.floor(Math.random() * this.possibleHands.length)];
        fnUpdateComputerChoice(systemHand);

        const gameEval = this.#resultLookup[playerHand][systemHand];

        // console.log(playerName, playerHand, systemHand, gameEval);

        await Utils.wait(OfflineGameService.DELAY_MS); // emulate async
        
        if (!Object.keys(this.#playerState).includes(playerName)) {
            this.#playerState[playerName] = { user: playerName, win: 0, lost: 0 };
        }
        this.#playerState[playerName].win += gameEval === 1 ? 1 : 0;
        this.#playerState[playerName].lost += gameEval === -1 ? 1 : 0;

        fnUpdateHistory(playerName, playerHand, systemHand, gameEval);

        return gameEval;
    }
}
