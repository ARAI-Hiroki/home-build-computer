function start() {
    const table = document.getElementById('main-table');
    const tiles = document.querySelectorAll('#main-table td');
    

    // 道の処理
    Array
        .from(tiles)
        .filter(tile => {
            const isBurning = tile.classList.contains('burning')
            const isIgnition = tile.classList.contains('ignition')
            const isLine = tile.classList.contains('line')
            return isIgnition || (isLine && !isBurning)
        })
        .forEach(tile => {
            
            const rowIndex = tile.parentNode.rowIndex;
            const cellIndex = tile.cellIndex;

            const effectedCells = [
                table.rows[rowIndex - 1].cells[cellIndex],
                table.rows[rowIndex + 1].cells[cellIndex],
                table.rows[rowIndex].cells[cellIndex - 1],
                table.rows[rowIndex].cells[cellIndex + 1]
            ]

            effectedCells
                .filter(cell => {
                    const c = cell.classList
                    const isLine = c.contains('line')
                    const isCircle = c.contains('circruit')
                    const isVacant = !(isLine || isCircle)
                    const isBurning = c.contains('burning')
                    return (!isVacant && !isBurning)                  
                })
                .forEach(cell => {
                    cell.classList.add('burning')
                })
        });

    // 回路の処理
    Array
        .from(tiles)
        .filter(tile => tile.classList.contains('circruit'))
        .forEach(tile => {
            const rowIndex = tile.parentNode.rowIndex;
            const cellIndex = tile.cellIndex;

            const top = table.rows[rowIndex - 1].cells[cellIndex]
            const left = table.rows[rowIndex].cells[cellIndex - 1]

            const inputCells = [
                table.rows[rowIndex - 1].cells[cellIndex], /* 上 */
                table.rows[rowIndex].cells[cellIndex - 1], /* 左 */
            ]

            inputCells.every(cell => cell.classList.contains('burning'))

            const outCell = table.rows[rowIndex].cells[cellIndex + 1]
            if (inputCells.every(cell => cell.classList.contains('burning'))) {
                outCell.classList.remove('ignition')
                outCell.classList.remove('burning')
            } else {
                outCell.classList.add('ignition')
            }
        })
}

function tileClicked(tile) {
    const c = ['line', 'circruit', 'ignition',  'vacant']
        
    const currentStatus = tile.className;
    const current = c.indexOf(currentStatus);

    tile.classList.remove(...tile.classList);
    tile.classList.add(c[(current + 1) % c.length]);
}


window.onload = function () {
    const table = document.getElementById('main-table');
    table.addEventListener('click', (e) => {
        tileClicked(e.target);
    });

    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', (e) => {
        start();
    });
}