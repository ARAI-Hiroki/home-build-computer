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
        .filter(cell => cell.classList.contains('line') && !cell.classList.contains('burning'))
        .forEach(cell => {
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
        outCell.classList.add('burning')
    }
}

function startButtonClicked() {

    Array
        .from(document.querySelectorAll('table td.circruit'))
        .forEach(tile => clock(tile))

    Array
        .from(document.querySelectorAll('table td.burning'))
        .forEach(tile => tile.classList.remove('burning'))

    Array
        .from(document.querySelectorAll('table td.ignition'))
        .forEach(tile => {
            tile.classList.add('burning')
            burn(tile)
        })
}

function tileClicked(e) {

    const tile = e.target
    const c = ['line', 'circruit', 'ignition', 'upload-point', 'vacant']

    const currentStatus = tile.className;
    const current = c.indexOf(currentStatus);

    tile.classList.remove(...tile.classList);

    if (!e.ctrlKey) {
        tile.classList.add(c[(current + 1) % c.length]);
    }

}

function zSelectChanged(e) {
    document
        .querySelectorAll('table')
        .forEach((table, index) => {
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
}

function createTable() {

    const x = document.querySelector('#colCount').value;
    const y = document.querySelector('#rowCount').value;
    const z = document.querySelector('#zCount').value;

    createSelectMenu(z);

    const activeZIndex = document.querySelector('#z-select').value - 1;

    const tableWrapper = document.getElementById('main-table-wrapper');
    tableWrapper.innerHTML = '';
    for (let i = 0; i < z; i++) {
        const table = document.createElement('table');

        table.style.position = 'absolute';
        table.style.zIndex = 3 - i;
        table.style.top = 3 * i + 'px';
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
        .forEach(table => table.addEventListener('click', tileClicked));

    document
        .querySelector('#z-select')
        .addEventListener('change', zSelectChanged);


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
    Array
        .from(circruitTiles)
        .map(tile => tile.classList)
        .forEach(tile => {
            tile.remove('burning')
            if (tile.contains('ignition')) {
                tile.remove('ignition')
                tile.add('line')
            }
        })
}


function trimRow(arr) {

    const isBlankArr = (arr) => arr.every((val) => val === "")
    let firstNonBlankRow = Infinity
    for (let z = 0; z < arr.length; z++) {
        for (let y = arr[z].length - 1; y >= 0; y--) {
            if (!isBlankArr(arr[z][y])) {
                firstNonBlankRow = Math.min(firstNonBlankRow, y)
            }
        }
    }

    for (let z = 0; z < arr.length; z++) {
        arr[z].splice(0, firstNonBlankRow)
    }

    return arr
}

function trim3DArray(arr) {
    const transpose = arr => arr.map(layer => layer[0].map((_, i) => layer.map(row => row[i])))
    const rotate90 = arr => transpose(arr.map(row => row.reverse()))

    for (let i = 0; i < 4; i++) {
        arr = rotate90(arr)
        arr = trimRow(arr)
    }

    return arr
}

function downloadButtonClicked() {

    const x = document.querySelector('#colCount').value
    const y = document.querySelector('#rowCount').value
    const z = document.querySelector('#zCount').value

    const tiles = Array.from(document.querySelectorAll('table td')).map(tile => tile.className)

    const data = []
    for (let i = 0; i < z; i++) {
        data.push([])
        for (let j = 0; j < y; j++) {
            data[i].push([])
            for (let k = 0; k < x; k++) {
                const index = k + (j * x) + (i * x * y)
                data[i][j][k] = tiles[index]
            }
        }
    }

    console.log(data[0])
    console.log(trim3DArray(data)[0])
    const blob = new Blob([JSON.stringify(trim3DArray(data), null, '  ')], { type: "application/json" });

    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);

    link.download = 'nand.json';

    link.click();
}

function fileUploadChanged() {
    const file = document.querySelector('#file-upload').files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
        const data = JSON.parse(e.target.result);
        console.log(data)
        const target = document.querySelector('.upload-point');
        const tables = document.querySelectorAll('table');

        const xIndex = target.cellIndex;
        const yIndex = target.parentNode.rowIndex;
        const zIndex = Array.from(tables).indexOf(target.parentNode.parentNode.parentNode);

        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                for (let k = 0; k < data[i][j].length; k++) {
                    const tile = tables[i + zIndex]?.rows[j + yIndex]?.cells[k + xIndex]
                    if (!tile) {
                        continue;
                    }
                    tile.classList.remove(...tile.classList);

                    const d = data[i][j][k]
                    if (!d) {
                        continue
                    }
                    tile.classList.add(...d.split(' '));
                }
            }
        }
    }

    reader.readAsText(file);
}

window.onload = function () {

    createTable();

    document
        .getElementById('start-button')
        .addEventListener('click', startButtonClicked);

    document
        .getElementById('resize-button')
        .addEventListener('click', createTable);

    document
        .getElementById('reset-button')
        .addEventListener('click', resetButtonClicked)

    document
        .querySelector('#download-button')
        .addEventListener('click', downloadButtonClicked)

    document
        .querySelector('#file-upload')
        .addEventListener('change', fileUploadChanged)

    document
        .querySelector('#z-select')
        .addEventListener('change', zSelectChanged);
}
