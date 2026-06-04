export default class DOMController {
    static renderBoard(boardElement, gameboard, isEnemy = false, onCellClick = null) {
        boardElement.innerHTML = '';
        boardElement.style.display = 'grid';
        boardElement.style.gridTemplateColumns = 'repeat(10, 30px)';
        boardElement.style.gridTemplateRows = 'repeat(10, 30px)';
        boardElement.style.gap = '2px';

        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                
                cell.style.width = '30px';
                cell.style.height = '30px';
                cell.style.border = '1px solid #ccc';
                cell.style.backgroundColor = '#fff';
                cell.style.cursor = isEnemy ? 'pointer' : 'default';

                const target = gameboard.grid[y][x];

                // 1. Reveal player's own ships (Hide enemy ships unless they are hit)
                if (target !== null && !isEnemy) {
                    cell.style.backgroundColor = '#94a3b8'; // Slate grey for healthy ships
                }

                // 2. Check if this specific cell has been attacked
                const isMiss = gameboard.getMissedAttacks().some(([mx, my]) => mx === x && my === y);
                
                // A cell is a "Hit" if there is a ship object here, but we need to know if it was attacked.
                // We can determine this by checking if it's an enemy square that was clicked, or we can look 
                // at whether the coordinate has been registered in the turn history.
                cell.dataset.attacked = "false";

                if (isMiss) {
                    cell.style.backgroundColor = '#cbd5e1'; // Light grey for miss
                    cell.textContent = '•';
                    cell.style.display = 'flex';
                    cell.style.justifyContent = 'center';
                    cell.style.alignItems = 'center';
                    cell.dataset.attacked = "true";
                }

                if (isEnemy && onCellClick) {
                    // Prevent clicking already attacked cells
                    if (cell.dataset.attacked === "true") {
                        cell.style.cursor = 'not-allowed';
                    }

                    cell.addEventListener('click', () => {
                        onCellClick([x, y], cell);
                    });
                }

                boardElement.appendChild(cell);
            }
        }
    }
}