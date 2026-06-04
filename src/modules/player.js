export default class Player {
    constructor(name, isComputer = false) {
        this.name = name;
        this.isComputer = isComputer;
        this.pastMoves = new Set(); // Stores string representations like "x,y" to look up moves instantly
    }

    attack(enemyBoard, [x, y]) {
        // Log this move so we know it's taken
        this.pastMoves.add(`${x},${y}`);
        return enemyBoard.receiveAttack([x, y]);
    }

    computerAttack(enemyBoard) {
        if (!this.isComputer) return;

        let x, y, moveKey;

        // Keep generating random coordinates until we find one we haven't attacked yet
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            moveKey = `${x},${y}`;
        } while (this.pastMoves.has(moveKey));

        // Execute the valid attack
        this.attack(enemyBoard, [x, y]);
        return [x, y];
    }
}