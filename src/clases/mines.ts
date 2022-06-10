import Grid from "./grid";
import { getRandom } from "./utils";

export class Mines {

    grid: Grid


    constructor (){

    }

    async init(rows: number, cols: number, mines: number){
        this.grid = new Grid(rows, cols);
        console.log('getting randoms');
        const rands = await getRandom(mines, [0, this.grid.grid.length-1]);
        console.log('another grid');
        let grid = new Grid(this.grid.rows, this.grid.cols);
        
        //construccion asignacion de valores de casillas
        grid.reset(0);
        rands.forEach(val => {
            grid.grid[val] = -1;
        });
        rands.forEach(val => {
            const {row, col} = grid.posToRowCol(val);
            grid.neighbour(row, col, (array : any[], pos: number) => {
                if(array[pos] != -1){
                    array[pos] = array[pos] + 1;
                }
            });
        });

        console.log(grid);

        //final encoded grid
        grid.iterate((row: number, col: number, val: string) => {
            const str = String(val) + '|h';
            this.grid.setVal(row, col, str);
        });

        console.log(this.grid);
    }

    async load(strframe: string){
        const strrows = strframe.split('.');
        const strcols = strrows[0].split(',');
        this.grid = new Grid(strrows.length, strcols.length);
        let rowcount = 0;
        strrows.forEach(rowstr => {
            const cols = rowstr.split(',');
            this.grid.rowAssign(rowcount, (pos: number, array: string[]) => {
                array[pos] = cols[pos % cols.length];
            });
            rowcount++;
        });
        console.log(this.grid);
        return;
    }

    
    async push(row: number, col: number){

        let pile : {row: number, col: number}[];
        pile = [];
        if((row < 0 || row >= this.grid.rows) || (col < 0 || col >= this.grid.rows) ){
            return 'OUT';
        }
        let actual = this.grid.getVal(row, col).split('|');
        if(actual[1] == 'r'){
            return 'NOP';
        }
        else{
            this.grid.setVal(row, col, actual[0]+'|r');
            if(actual[0] == '-1'){
                return 'LOSE';
            }
            this.grid.neighbour(row, col, (array : string[], pos: number) => {
                const strfr = array[pos].split('|');
                const val = strfr[0];
                const st = strfr[1];
                if(st == 'h' && val == '0'){
                    pile.push(this.grid.posToRowCol(pos));
                }
            });    
        }

        //revelar celdas vacias que son vecinas, evita recursividad con pila
        while(pile.length != 0){
            const npos = pile.pop();
            if(npos){
                actual = this.grid.getVal(npos.row, npos?.col).split('|');
                this.grid.setVal(npos.row, npos.col, actual[0]+'|r');
                this.grid.neighbour(npos.row, npos.col, (array : string[], pos: number) => {
                    const strfr = array[pos].split('|');
                    const val = strfr[0];
                    const st = strfr[1];
                    if(st == 'h' && val == '0'){
                        pile.push(this.grid.posToRowCol(pos));
                    }
                });
            }
        }

        //check finished
        let won = true;
        this.grid.iterate((row: number, col: number, val: string) => {
            const cell = val.split('|');
            if(cell[0] != '-1' && cell[1] == 'h'){
                won=false;
            }
        });

        if(won)
            return 'WIN';
        else{
            return 'CONTINUE';
        }
    }

    async renderdb(){
        let str = '';
        this.grid.rowiterate((row: string[]) => {
            str = str + (row.join() + '.');
        });
        str = str.slice(0, str.length-1);
        return str;
    }

    async render(){
        let count = 0;
        let render_obj : {[key: string]: any};
        render_obj = {};
        this.grid.rowiterate((row: string[]) => {
       
            const rowstring = row.reduce((previous, current) => {

                const val = current.split('|');
                if(val[1] == 'h'){
                    return previous+'?';
                }
                else{
                    if(val[0] == '-1'){
                        return previous+'o';
                    }
                    else{
                        return previous+val[0];
                    }
                }

            }, '');

            if(count < 10){
                render_obj['AA'+String(count)] = rowstring;
                count++;
                console.log(render_obj);
            }
            else{
                render_obj['B'+String(count)] = rowstring;
                count++;
                console.log(render_obj);
            }
            
        });

        return render_obj;
    }
}
