const TILE_STATUS = {
    VACANT: 0,
    LINE: 1,
    CIRCUIT: 2,
    IGNITION: 4,
    BURNING: 8,
    BURNED: 16
}

function setTileAttribute(td, status) {
    td.setAttribute('data-status', status);

}

class TileWrapper {
    constructor(td) {
        this.tile = td.classList;
    }


    
    burn() {
        this.tile.add('burning');
    }

    burnOut() {
        this.tile.remove('burning');
    }
}


const mainTable = {
    current: null,
    before: null,
    next: null
}

class TILE_STATUS {
    constructor() {
        this._classes = {
            NONE: '',
            LINE: 'lightgray',
            LINE_BURNING: 'red',
            CIRCUIT: 'darkslategray',
            CIRCUIT_BURNING: 'maroon'
        }
    }

    get LINE_BURNING() {
        return this._classes.LINE_BURNING;
    }

    get LINE() {
        return this._classes.LINE;
    }

    get NONE() {
        return this._classes.NONE;
    }

    get CIRCUIT() {
        return this._classes.CIRCUIT;
    }

    get CIRCUIT_BURNING() {
        return this._classes.CIRCUIT_BURNING;
    }

    static toggleTile(target) {
        const c = ['line', 'circruit', 'ignition',  'vacant']
        
        const currentStatus = target.className;
        const current = c.indexOf(currentStatus);

        target.classList.remove(...target.classList);
        target.classList.add(c[(current + 1) % c.length]);
    }
}

class Tile extends HTMLTableCellElement {
    constructor(current, before, left, top, right, bottom) {
        this.current = current;
        this.before = before;
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
    }

    set current(value) {
        this.current = value;
    }

    set before(value) {
        this.before = value;
    }

    set left(value) {
        this.left = value;
    }

    set top(value) {
        this.top = value;
    }

    set right(value) {
        this.right = value;
    }

    set bottom(value) {
        this.bottom = value;
    }

    next() {
        const canBurn = [this.left, this.top, this.right, this.bottom].some(cell => cell === TILE_STATUS.LINE_BURNING || cell === TILE_STATUS.CIRCUIT_BURNING);
        const wasBurned = this.before === TILE_STATUS.LINE_BURNING || this.before === TILE_STATUS.CIRCUIT_BURNING;
        const doesBurn = canBurn && !wasBurned
        const isLine = [TILE_STATUS.LINE, TILE_STATUS.LINE_BURNING].some(stat => stat === this.current)
        const isCircle = [TILE_STATUS.CIRCUIT, TILE_STATUS.CIRCUIT_BURNING].some(stat => stat === this.current)

        // 道が燃える場合
        if (doesBurn && isLine) {
            this.current = TILE_STATUS.LINE_BURNING;
        }

        // 回路が燃える場合
        if (doesBurn && isCircle) {
            this.current = TILE_STATUS.CIRCUIT_BURNING
        }

        // 道が燃えない場合
        if (!doesBurn && isLine) {
            this.current = TILE_STATUS.LINE
        }

        if

    }
}




function fire(table, td) {
    const rowIndex = td.parentNode.rowIndex;
    const cellIndex = td.cellIndex;

    const effectedCells = [
        table.current.rows[rowIndex - 1].cells[cellIndex],
        table.current.rows[rowIndex + 1].cells[cellIndex],
        table.current.rows[rowIndex].cells[cellIndex - 1],
        table.current.rows[rowIndex].cells[cellIndex + 1]
    ]

    effectedCells.forEach(cell => {
        const isLine = cell.style.backgroundColor === 'lightgray';
        console.log(table.before.rows[cell.parentNode.rowIndex].cells[cell.cellIndex])
        const beforeFired = table.before.rows[cell.parentNode.rowIndex].cells[cell.cellIndex].style.backgroundColor === 'red';
        if (cell && isLine && !beforeFired) {
            mainTable.next.rows[cell.parentNode.rowIndex].cells[cell.cellIndex].style.backgroundColor = 'red';
        }
    })
    mainTable.next.rows[rowIndex].cells[cellIndex].style.backgroundColor = 'lightgray';
}


function go() {
    if (mainTable.current === null) {
        mainTable.before =  document.getElementById('main-table');    
        mainTable.current = mainTable.before
    }else {
        mainTable.before = mainTable.current.cloneNode(true);
        mainTable.current = document.getElementById('main-table'); 
    }

    mainTable.next = document.getElementById('main-body').cloneNode(true);

    const tableTds = document.querySelectorAll('#main-table td');
    tableTds.forEach(td => {
        switch (td.style.backgroundColor) {
            case 'red':
                fire(mainTable, td);
                break;
            case 'gray':
                if (mainTable.before.rows[td.parentNode.rowIndex].cells[td.cellIndex].style.backgroundColor === 'red') {
                    td.style.backgroundColor = 'lightgray';
                    break;
                }
        }
    })

    // const newTds = Array
    //     .from(tableTds)
    //     .map(td => {
    //         switch (td.style.backgroundColor) {
    //             case 'red':
    //                 fire(mainTable, td);
    //                 break;
    //             case 'gray':
    //                 if (mainTable.before.rows[td.parentNode.rowIndex].cells[td.cellIndex].style.backgroundColor === 'red') {
    //                     td.style.backgroundColor = 'lightgray';
    //                     break;
    //                 }
    //         }
    //     })
    //     .map(color => {
    //         const td = document.createElement('td')
    //         td.style.backgroundColor = color
    //         return td
    //     })

    // const fragment = document.createDocumentFragment()
    // for (i = 0; i < 10; i++) {
    //     const tr = document.createElement('tr')
    //     for (j = 0; j < 10; j++) {
    //         tr.appendChild(newTds[i * 10 + j])
    //     }
    //     fragment.appendChild(tr)
    // }


    while (mainTable.current.firstChild) {
        mainTable.current.removeChild(mainTable.current.firstChild);
    }

    mainTable.current.appendChild(mainTable.next)


    // Array
    //     .from(tableTds)
    //     .forEach(td => {
    //         switch (td.style.backgroundColor) {
    //             case 'red':
    //                 fire(mainTable, td);
    //                 break;
    //             case 'gray':
    //                 if (mainTable.before.rows[td.parentNode.rowIndex].cells[td.cellIndex].style.backgroundColor === 'red') {
    //                 td.style.backgroundColor = 'lightgray';
    //                 break;
    //         }
    //     })
}


window.onload = function () {
    const table = document.getElementById('main-table');
    table.addEventListener('click', (e) => {
        TILE_STATUS.toggleTile(e.target);
    });
}