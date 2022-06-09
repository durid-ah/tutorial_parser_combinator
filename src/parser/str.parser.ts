import { Parser, State, updateError, updateState } from ".";
import { newOne } from "./models/result-type.model";
import { newErr, newOk, ResError } from "./models/result.model";

export function str(s: string): Parser { 
   return new Parser(
      ({index, target, result}: State): State => {
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