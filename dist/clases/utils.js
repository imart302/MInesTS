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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandom = void 0;
const getRandom = (times, range) => __awaiter(void 0, void 0, void 0, function* () {
    let term_criteria = false;
    let rands;
    rands = [];
    let num;
    while (!term_criteria) {
        num = Math.floor(Math.random() * (range[1] - range[0])) + range[0];
        if (!rands.includes(num)) {
            rands.push(num);
            if (rands.length == times) {
                term_criteria = true;
            }
        }
    }
    return rands;
});
exports.getRandom = getRandom;
//# sourceMappingURL=utils.js.map