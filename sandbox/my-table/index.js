class Tile extends HTMLTableCellElement {
    constructor(current, before) {
        this.current = current;
        this.before = before;
    }

    set current(value) {
        this.current = value;
    }

    set before(value) {
        this.before = value;
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

    }
}