import { Parser, State, updateError, updateState } from ".";
import { newOne } from "./models/result-type.model";
import { newErr, newOk, ResError } from "./models/result.model";

/**
 * @typeparam `<T = string>` the type of the preceeding state 
 * @param s the string that needs to be found in the parser
 * @returns 
 */
export function str<T = string>(s: string): Parser<T> { 
   return new Parser<T>(
      ({index, target, result}: State<T>): State => {
         const state = {index, target, result: null};
         if (result) return state;
             
         const slicedTarget = target.slice(index);
         if (slicedTarget.length === 0) {
            const err: ResError<string> = 
               newErr(
                  `str: Tried to match ${s}, but got unexpected end of input`);

            return updateError(state, err)
         }
            
         if (slicedTarget.startsWith(s)) {
            const result = newOk(newOne(s))
            return updateState(state, index + s.length, result);
         }
            
         return updateError(
            state, 
            newErr(`str: Tried to match ${s}, but got "${target.slice(index, index + 10)}"`));
      });
}