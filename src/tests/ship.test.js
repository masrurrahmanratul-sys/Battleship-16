import Ship from '../modules/ship.js';

describe('Ship Factory / Class', () => {
    test('should initialize with a length and 0 hits', () => {
        const myShip = new Ship(4);
        expect(myShip.length).toBe(4);
        expect(myShip.hits).toBe(0);
    });

    test('should increment hits when hit() is called', () => {
        const myShip = new Ship(3);
        myShip.hit();
        expect(myShip.hits).toBe(1);
    });

    test('should not be sunk initially', () => {
        const myShip = new Ship(2);
        expect(myShip.isSunk()).toBe(false);
    });

    test('should be sunk when hits equal or exceed length', () => {
        const myShip = new Ship(2);
        myShip.hit();
        myShip.hit();
        expect(myShip.isSunk()).toBe(true);
    });
});