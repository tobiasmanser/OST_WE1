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
            win: 4,
            lost: 5,
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
        // TODO create ranking from playerState for Example: [{rank: 1, wins: 10, players: ["Michael", "Lias"]}, {rank: 2, wins: 5, players: ["Max"]}]
        return Promise.resolve(this.#playerState);
    }

    // TODO
    async evaluate(playerName, playerHand, systemHand) {
        console.log(playerName, playerHand, systemHand);
        const gameEval = this.#resultLookup[playerHand][systemHand];

        console.log(playerName, playerHand, systemHand, gameEval);

        await Utils.wait(OfflineGameService.DELAY_MS); // emulate async

        return gameEval;
    }
}
