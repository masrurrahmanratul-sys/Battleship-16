import Gameboard from '../modules/gameboard.js';
import Ship from '../modules/ship.js';

describe('Gameboard Factory / Class', () => {
    let board;

    beforeEach(() => {
        board = new Gameboard();
    });

    test('should be able to place a ship at specific coordinates', () => {
        const ship = new Ship(3);
        // Place ship at coordinates x=0, y=0 horizontally
        board.placeShip(ship, [0, 0], 'horizontal');
        
        // If we attack a coordinate the ship occupies, it should register as a hit
        expect(board.receiveAttack([1, 0])).toBe(true);
    });

    test('should record missed shots', () => {
        board.receiveAttack([5, 5]);
        expect(board.getMissedAttacks()).toContainEqual([5, 5]);
    });

    test('should report false if not all ships are sunk', () => {
        const ship1 = new Ship(1);
        board.placeShip(ship1, [0, 0], 'horizontal');
        expect(board.allShipsSunk()).toBe(false);
    });

    test('should report true when all ships are sunk', () => {
        const ship1 = new Ship(1);
        board.placeShip(ship1, [0, 0], 'horizontal');
        board.receiveAttack([0, 0]);
        expect(board.allShipsSunk()).toBe(true);
    });
});