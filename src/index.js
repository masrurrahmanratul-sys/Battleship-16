import Player from './modules/player.js';
import Gameboard from './modules/gameboard.js';
import Ship from './modules/ship.js';
import DOMController from './modules/domController.js';

// 1. Setup Gameboards and Players
const playerBoard = new Gameboard();
const computerBoard = new Gameboard();

const humanPlayer = new Player('Player 1', false);
const computerPlayer = new Player('AI', true);

// Ships to be placed [length, length, length...]
const shipsToPlace = [5, 4, 3, 3, 2];
let currentShipIndex = 0;
let currentOrientation = 'horizontal'; // Can toggle to 'vertical'

function setupComputerShips() {
    shipsToPlace.forEach(length => {
        let placed = false;
        while (!placed) {
            const x = Math.floor(Math.random() * 10);
            const y = Math.floor(Math.random() * 10);
            const orientation = Math.random() > 0.5 ? 'horizontal' : 'vertical';
            
            try {
                if (orientation === 'horizontal' && x + length > 10) continue;
                if (orientation === 'vertical' && y + length > 10) continue;
                
                computerBoard.placeShip(new Ship(length), [x, y], orientation);
                placed = true;
            } catch (err) {
                // Retry if space is occupied
            }
        } // This closes the while loop
    }); // This closes the forEach loop
} // This closes the setupComputerShips function

// Now run the function cleanly outside of its own block
setupComputerShips();


// 2. Grab DOM elements
const playerBoardUI = document.getElementById('player-board');
const computerBoardUI = document.getElementById('computer-board');

// Create a small instruction element dynamically
const instructionText = document.createElement('h3');
instructionText.textContent = `Place your 5-unit ship (Click a square to place. Press 'R' to rotate)`;
document.body.insertBefore(instructionText, document.getElementById('game-container'));

// Listen for 'R' key to rotate the ship placement orientation
window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') {
        currentOrientation = currentOrientation === 'horizontal' ? 'vertical' : 'horizontal';
        updateUI();
    }
});

// 3. Central UI Sync Function
// 3. Central UI Sync Function
function updateUI() {
    const isPlacementPhase = currentShipIndex < shipsToPlace.length;

    if (isPlacementPhase) {
        instructionText.textContent = `Placing ship of size ${shipsToPlace[currentShipIndex]} (${currentOrientation}). Press 'R' to rotate.`;
        computerBoardUI.style.opacity = '0.3'; // Dim enemy board during setup
        
        // Explicitly accept both coordinates and the cell reference from the DOM controller
        DOMController.renderBoard(playerBoardUI, playerBoard, false, (coordinates, cellElement) => {
            handlePlacement(coordinates);
        });
        
        // Don't let player click enemy board yet
        DOMController.renderBoard(computerBoardUI, computerBoard, true, null);
    } else {
        instructionText.textContent = "Battle Phase! Click the Enemy Board to attack.";
        computerBoardUI.style.opacity = '1';
        
        // Game is live! Pass both arguments down to the turn mechanism
        DOMController.renderBoard(playerBoardUI, playerBoard, false);
        DOMController.renderBoard(computerBoardUI, computerBoard, true, (coordinates, cellElement) => {
            handleTurn(coordinates, cellElement);
        });
    }
}

// 4. Handle Placement Clicks
function handlePlacement(coordinates) {
    // Safety check to ensure arrays didn't get scrambled over the callback bridge
    if (!coordinates || coordinates.length < 2) return;

    const length = shipsToPlace[currentShipIndex];
    const x = coordinates[0];
    const y = coordinates[1];

    // Out of bounds safety checks
    if (currentOrientation === 'horizontal' && x + length > 10) return alert("Ship out of bounds!");
    if (currentOrientation === 'vertical' && y + length > 10) return alert("Ship out of bounds!");

    try {
        playerBoard.placeShip(new Ship(length), [x, y], currentOrientation);
        currentShipIndex++;
        updateUI(); // Redraw immediately to see the slate grey ship!
    } catch (error) {
        alert("Cannot overlap existing ships!");
    }
}

// 5. Battle Turn Controller
function handleTurn(coordinates, clickedCell) {
    const [x, y] = coordinates;
    const moveKey = `${x},${y}`;
    
    if (humanPlayer.pastMoves.has(moveKey)) return;

    // Human Attacks
    humanPlayer.attack(computerBoard, coordinates);
    
    if (computerBoard.allShipsSunk()) {
        setTimeout(() => alert('Victory! You sank all enemy battleships! '), 100);
        return;
    }

    // Computer Counter-Attacks
    computerPlayer.computerAttack(playerBoard);

    if (playerBoard.allShipsSunk()) {
        setTimeout(() => alert('Defeat! The enemy AI sank your fleet. '), 100);
        return;
    }

    updateUI();
}

// Kickoff initial setup layout
updateUI();