class Grid{ 
    rows: number;
    cols: number;
    cells: number;
    grid: any[];

    constructor (rows: number, cols: number){
        this.rows = rows;
        this.cols = cols;
        this.cells = this.rows*this.cols;
        console.log('here');
        this.grid = new Array(this.cells);
        console.log('here');
    }

    reset(val: any){
        this.grid.fill(val);
    }
    
    setVal(row: number, col: number, val: any) {
        if(row >= this.rows || col >= this.cols){
            throw {message: `Grid out of boundaries (${row}, ${col})`}
        }
        else{
            const pos = row*this.cols + col;
            this.grid[pos] = val;
        }
    }

    neighbour(row: number, col: number, operation: Function){
        if(row < this.rows && col < this.cols){
            const displacement = [-1, 0, 1];
            displacement.forEach(val1 => {
                const rowdis = row + val1;
                displacement.forEach(val2 => {
                    const coldis = col + val2;
                    if(rowdis != row || coldis != col){
                        if((rowdis >= 0 && rowdis < this.rows) && (coldis >= 0 && coldis < this.cols)){
                            const pos = rowdis*this.cols + coldis;
                            operation(this.grid, pos);
                        }
                    }
                });
            });
        }
    }

    iterate(operation: Function){
        for(let row = 0; row < this.rows; row++){
            for(let col = 0; col < this.cols; col++){
                const val = this.getVal(row, col);
                operation(row, col, val);
            }
        }
    }

    rowiterate(operation: Function){
        for(let row = 0; row < this.cells; row=row+this.cols){
            const slice = this.grid.slice(row, row+this.cols);
            operation(slice);
        }
    }

    rowAssign(row: number, operation: Function){
        const begin = row * this.cols;
        const end = begin + this.cols;
        for(let i = begin; i < end; i++){
            operation(i, this.grid);
        }
    }
    

    getVal(row: number, col: number){
        if(row >= this.rows || col >= this.cols){
            throw {message: `Grid out of boundaries (${row}, ${col})`}
        }
        else{
            const pos = row*this.cols + col;
            return this.grid[pos];
        }
    }

    rowColToPos(row: number, col: number){
        return row*this.cols + col;
    }

    posToRowCol(pos: number){
        const row = Math.floor(pos/this.cols);
        const col = pos % this.cols;
        return {row, col};
    }
}

export default Grid;