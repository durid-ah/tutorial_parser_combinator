import { Parser, State } from "./models/parser.model";
import { newOne } from "./models/result-cardinal.model";
import { mapErr, newErr, newOk, ResultType } from "./models/result.model";

const lettersRegex = /^[A-Za-z]+/;
export function letters<T>(){ 
   return new Parser<T>(
      (state: State<T>): State<string> => {
         const {index, target, result} = state;
         if (result.resType === ResultType.Error) return mapErr(state);

         const slicedTarget = target.slice(index);
         if (slicedTarget.length === 0) {
            const err = newErr(`letter: Unexpected end of input`);
            return {...state, result: err};
         }

         const regexMatch = slicedTarget.match(lettersRegex);
         if (regexMatch) {
            const res = newOk(newOne(regexMatch[0])); 
            return {
               ...state,
               index: index + regexMatch[0].length, 
               result: res
            };
         } 

         const err = newErr(`letter: Couldn't match letters at index ${index}`);
         return {...state, result: err};
      });
}