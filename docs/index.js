function burn(tile) {
    const tables = document.querySelectorAll('table');

    const rowIndex = tile.parentNode.rowIndex;
    const cellIndex = tile.cellIndex;

    const currentTable = tile.parentNode.parentNode.parentNode

    const zIndex = Array.from(tables).indexOf(currentTable)

    const effectedCells = [
        tables[zIndex - 1]?.rows[rowIndex]?.cells[cellIndex], /* 前 */
        tables[zIndex + 1]?.rows[rowIndex]?.cells[cellIndex], /* 後 */
        tables[zIndex]?.rows[rowIndex - 1]?.cells[cellIndex], /* 上 */
        tables[zIndex]?.rows[rowIndex + 1]?.cells[cellIndex], /* 下 */
        tables[zIndex]?.rows[rowIndex]?.cells[cellIndex - 1], /* 左 */
        tables[zIndex]?.rows[rowIndex]?.cells[cellIndex + 1]  /* 右 */
    ]
    effectedCells
        .filter(cell => cell)
        .filter(cell => {
            const c = cell.classList
            const isLine = c.contains('line')
            const isBurning = c.contains('burning')
            return isLine && !isBurning
        }).forEach(cell => {
            cell.classList.add('burning')
            burn(cell)
        })

}

function clock(tile) {

    const table = tile.parentNode.parentNode.parentNode

    const rowIndex = tile.parentNode.rowIndex;
    const cellIndex = tile.cellIndex;

    const inputCells = [
        table.rows[rowIndex - 1].cells[cellIndex], /* 上 */
        table.rows[rowIndex].cells[cellIndex - 1], /* 左 */
    ]

    const outCell = table.rows[rowIndex].cells[cellIndex + 1]

    if (inputCells.every(cell => cell.classList.contains('burning'))) {
        outCell.classList.remove('ignition')
        outCell.classList.remove('burning')

    } else {
        outCell.classList.add('ignition')
    }
}

function start() {

    const circruitTiles = document.querySelectorAll('table td.circruit');

    Array.from(circruitTiles).forEach(tile => {
        clock(tile)
    })

    const burningTiles = document.querySelectorAll('table td.burning');
    Array.from(burningTiles).forEach(tile => {
        tile.classList.remove('burning')
    })

    const ignitionTiles = document.querySelectorAll('table td.ignition');

    Array.from(ignitionTiles).forEach(tile => {
        burn(tile)
    })
}

function tileClicked(e) {

    const tile = e.target
    const c = ['line', 'circruit', 'ignition', 'vacant']

    const currentStatus = tile.className;
    const current = c.indexOf(currentStatus);

    tile.classList.remove(...tile.classList);
    tile.classList.add(c[(current + 1) % c.length]);
}

function createTable() {

    const zCount = document.querySelector('#zCount').value;
    createSelectMenu(zCount);

    const x = document.getElementById('rowCount').value;
    const y = document.getElementById('colCount').value;
    const z = document.querySelector('#zCount').value;
    const activeZIndex = document.querySelector('#z-select').value -1;

    const tableWrapper = document.getElementById('main-table-wrapper');
    tableWrapper.innerHTML = '';
    for (let i = 0; i < z; i++) {
        const table = document.createElement('table');

        table.style.position = 'absolute';
        table.style.zIndex = 3 - i;
        table.style.top=  3 * i + 'px';
        table.style.left = 3 * i + 'px';

        if (i !== activeZIndex) {
            table.classList.add('inactive');
        }

        for (let j = 0; j < y; j++) {
            const row = table.insertRow();
            for (let k = 0; k < x; k++) {
                row.insertCell();
            }
        }
        tableWrapper.appendChild(table);
    }

    document
        .querySelectorAll('table')
        .forEach(table => table.addEventListener('click', tileClicked));    document
        .querySelector('#z-select')
        .addEventListener('change', (e) => {
        document.querySelectorAll('table').forEach((table, index) => {

            const active = index === e.target.value - 1;
            table.addEventListener('click', tileClicked)
            table.classList.remove('inactive')
            table.style.zIndex = 3 - index;
            
            if (!active) {
                table.style.zIndex = table.style.zIndex - 100;
                table.classList.add('inactive');
                table.removeEventListener('click', tileClicked);
            }
        })
    });

}

function createSelectMenu(count) {

    const select = document.querySelector('#z-select');
    select.innerHTML = '';

    for (let i = 1; i <= count; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        option.selected = i === 1;
        select.appendChild(option);
    }
}


function resetButtonClicked() {
    const circruitTiles = document.querySelectorAll('td');
    Array.from(circruitTiles).forEach(tile => {
        tile.classList.remove('burning')
        if (tile.classList.contains('ignition')) {
            tile.classList.remove('ignition')
            tile.classList.add('line')
        }
    })
}

window.onload = function () {

    createTable();

    document
        .getElementById('start-button')
        .addEventListener('click', start);

    document
        .getElementById('resize-button')
        .addEventListener('click', createTable);

        document
        .getElementById('reset-button')
        .addEventListener('click', resetButtonClicked)

    document
        .querySelector('#z-select')
        .addEventListener('change', (e) => {
        document.querySelectorAll('table').forEach((table, index) => {

            const active = index === e.target.value - 1;
            table.addEventListener('click', tileClicked)
            table.classList.remove('inactive')
            table.style.zIndex = 3 - index;
            
            if (!active) {
                table.style.zIndex = table.style.zIndex - 100;
                table.classList.add('inactive');
                table.removeEventListener('click', tileClicked);
            }
        })
    });
}
