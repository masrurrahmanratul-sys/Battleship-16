import Player from '../modules/player.js';
import Gameboard from '../modules/gameboard.js';

describe('Player Module', () => {
    let humanPlayer;
    let computerPlayer;
    let enemyBoard;

    beforeEach(() => {
        humanPlayer = new Player('Human', false);
        computerPlayer = new Player('Computer', true);
        enemyBoard = new Gameboard();
    });

    test('should initialize with a name and check if it is a computer player', () => {
        expect(humanPlayer.name).toBe('Human');
        expect(humanPlayer.isComputer).toBe(false);
        expect(computerPlayer.isComputer).toBe(true);
    });

    test('human player can attack an enemy gameboard', () => {
        // Attack coordinate [2, 3] on the enemy board
        const hitRegistered = humanPlayer.attack(enemyBoard, [2, 3]);
        // It should return false because it is an empty space (a miss), but it should execute
        expect(hitRegistered).toBe(false);
        expect(enemyBoard.getMissedAttacks()).toContainEqual([2, 3]);
    });

    test('computer player can make a random, valid attack', () => {
        const randomCoord = computerPlayer.computerAttack(enemyBoard);
        
        // Ensure the returned coordinate is within the 10x10 bounds
        expect(randomCoord[0]).toBeGreaterThanOrEqual(0);
        expect(randomCoord[0]).toBeLessThan(10);
        expect(randomCoord[1]).toBeGreaterThanOrEqual(0);
        expect(randomCoord[1]).toBeLessThan(10);
        
        // Ensure it recorded the attack on the board
        expect(enemyBoard.getMissedAttacks()).toContainEqual(randomCoord);
    });
});