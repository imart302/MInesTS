"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mines = void 0;
const grid_1 = __importDefault(require("./grid"));
const utils_1 = require("./utils");
class Mines {
    constructor() {
    }
    init(rows, cols, mines) {
        return __awaiter(this, void 0, void 0, function* () {
            this.grid = new grid_1.default(rows, cols);
            console.log('getting randoms');
            const rands = yield (0, utils_1.getRandom)(mines, [0, this.grid.grid.length - 1]);
            console.log('another grid');
            let grid = new grid_1.default(this.grid.rows, this.grid.cols);
            //construccion asignacion de valores de casillas
            grid.reset(0);
            rands.forEach(val => {
                grid.grid[val] = -1;
            });
            rands.forEach(val => {
                const { row, col } = grid.posToRowCol(val);
                grid.neighbour(row, col, (array, pos) => {
                    if (array[pos] != -1) {
                        array[pos] = array[pos] + 1;
                    }
                });
            });
            console.log(grid);
            //final encoded grid
            grid.iterate((row, col, val) => {
                const str = String(val) + '|h';
                this.grid.setVal(row, col, str);
            });
            console.log(this.grid);
        });
    }
    load(strframe) {
        return __awaiter(this, void 0, void 0, function* () {
            const strrows = strframe.split('.');
            const strcols = strrows[0].split(',');
            this.grid = new grid_1.default(strrows.length, strcols.length);
            let rowcount = 0;
            strrows.forEach(rowstr => {
                const cols = rowstr.split(',');
                this.grid.rowAssign(rowcount, (pos, array) => {
                    array[pos] = cols[pos % cols.length];
                });
                rowcount++;
            });
            console.log(this.grid);
            return;
        });
    }
    push(row, col) {
        return __awaiter(this, void 0, void 0, function* () {
            let pile;
            pile = [];
            if ((row < 0 || row >= this.grid.rows) || (col < 0 || col >= this.grid.rows)) {
                return 'OUT';
            }
            let actual = this.grid.getVal(row, col).split('|');
            if (actual[1] == 'r') {
                return 'NOP';
            }
            else {
                this.grid.setVal(row, col, actual[0] + '|r');
                if (actual[0] == '-1') {
                    return 'LOSE';
                }
                this.grid.neighbour(row, col, (array, pos) => {
                    const strfr = array[pos].split('|');
                    const val = strfr[0];
                    const st = strfr[1];
                    if (st == 'h' && val == '0') {
                        pile.push(this.grid.posToRowCol(pos));
                    }
                });
            }
            //revelar celdas vacias que son vecinas, evita recursividad con pila
            while (pile.length != 0) {
                const npos = pile.pop();
                if (npos) {
                    actual = this.grid.getVal(npos.row, npos === null || npos === void 0 ? void 0 : npos.col).split('|');
                    this.grid.setVal(npos.row, npos.col, actual[0] + '|r');
                    this.grid.neighbour(npos.row, npos.col, (array, pos) => {
                        const strfr = array[pos].split('|');
                        const val = strfr[0];
                        const st = strfr[1];
                        if (st == 'h' && val == '0') {
                            pile.push(this.grid.posToRowCol(pos));
                        }
                    });
                }
            }
            //check finished
            let won = true;
            this.grid.iterate((row, col, val) => {
                const cell = val.split('|');
                if (cell[0] != '-1' && cell[1] == 'h') {
                    won = false;
                }
            });
            if (won)
                return 'WIN';
            else {
                return 'CONTINUE';
            }
        });
    }
    renderdb() {
        return __awaiter(this, void 0, void 0, function* () {
            let str = '';
            this.grid.rowiterate((row) => {
                str = str + (row.join() + '.');
            });
            str = str.slice(0, str.length - 1);
            return str;
        });
    }
    render() {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            let render_obj;
            render_obj = {};
            this.grid.rowiterate((row) => {
                const rowstring = row.reduce((previous, current) => {
                    const val = current.split('|');
                    if (val[1] == 'h') {
                        return previous + '?';
                    }
                    else {
                        if (val[0] == '-1') {
                            return previous + 'o';
                        }
                        else {
                            return previous + val[0];
                        }
                    }
                }, '');
                if (count < 10) {
                    render_obj['AA' + String(count)] = rowstring;
                    count++;
                    console.log(render_obj);
                }
                else {
                    render_obj['B' + String(count)] = rowstring;
                    count++;
                    console.log(render_obj);
                }
            });
            return render_obj;
        });
    }
}
exports.Mines = Mines;
//# sourceMappingURL=mines.js.map