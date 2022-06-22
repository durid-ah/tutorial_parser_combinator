import { Parser, SequenceOf } from ".";
import { newMany } from "./models/result-cardinal.model";
import { newOk } from "./models/result.model";

export function Between<R1, R2, T, E>(left: Parser<R1,R2,T,E>, right: Parser<R1,R2,T,E>) {
   return (content: Parser<R1, R2, T, E>) => 
      SequenceOf<R1, R2, T, E>([left, content, right])
         .map<R2>(res => {
            const resArr = res.result.value as R2[];
            const betweenRes = [...resArr.slice(1, -1)]
            return newOk(newMany(betweenRes));
         });
}