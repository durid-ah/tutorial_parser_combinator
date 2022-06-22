import { Parser, updateError, updateState } from ".";
import { newOne } from "./models/result-cardinal.model";
import { newErr, newOk, ResError, ResultType } from "./models/result.model";
import { State } from "./models/state.model";

/**
 * @typeparam `<T1 = string>` the type of the preceeding state 
 * @typeparam `<T2 = string>` the type of the preceeding state 
 * @param s the string that needs to be found in the parser
 * @returns 
 */
export function Str(s: string): Parser { 
   return new Parser(
      ({index, target, result}: State): State => {
         const state = {index, target, result: null};
         if (result.resType === ResultType.Error) return state;
             
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