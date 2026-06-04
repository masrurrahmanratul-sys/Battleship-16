export default class Gameboard {
    constructor() {
        // Create a 10x10 grid initialized with null
        this.grid = Array(10).fill(null).map(() => Array(10).fill(null));
        this.missedAttacks = [];
        this.ships = [];
    }

    placeShip(ship, [startX, startY], orientation) {
        this.ships.push(ship);
        
        for (let i = 0; i < ship.length; i++) {
            const x = orientation === 'horizontal' ? startX + i : startX;
            const y = orientation === 'vertical' ? startY + i : startY;
            
            // Store a reference to the ship object and its index/part at this coordinate
            this.grid[y][x] = ship;
        }
    }

    receiveAttack([x, y]) {
        const target = this.grid[y][x];

        if (target !== null) {
            // It's a hit! Call the hit() method on the ship object found there
            target.hit();
            return true;
        } else {
            // It's a miss. Record the coordinates
            this.missedAttacks.push([x, y]);
            return false;
        }
    }

    getMissedAttacks() {
        return this.missedAttacks;
    }

    allShipsSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}