import { Parser, sequenceOf } from ".";
import { newMany } from "./models/result-type.model";
import { newOk } from "./models/result.model";

export function between<T, R, E>(left: Parser<T, R, E>, right: Parser<T,R,E>) {
   return (content: Parser<T, R, E>) => 
      sequenceOf<T, R, E>([left, content, right])
         .map<R>(res => {
            const resArr = res.result.value as R[];
            const betweenRes = [...resArr.slice(1, -1)]
            return newOk(newMany(betweenRes));
         });
}