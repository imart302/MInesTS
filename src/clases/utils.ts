import { randomInt } from "crypto";


export const getRandom = async (times: number, range: number[]) => {

    let term_criteria = false;
    let rands : number[];
    rands = [];
    let num: number;
    while(!term_criteria){
        num = Math.floor( Math.random()*(range[1] - range[0])) + range[0]
           
        if(!rands.includes(num)){
            rands.push(num);
            if(rands.length == times){
                term_criteria = true;
            }
        }
            
    }
    return rands;
}

