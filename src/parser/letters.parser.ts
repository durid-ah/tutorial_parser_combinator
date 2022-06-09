import { ERR_RESULT, Parser, State } from "./models/parser.model";
import { updateError, updateState } from "./models/parsers.helper";
import { newOne } from "./models/result-type.model";
import { newErr, newOk } from "./models/result.model";

const lettersRegex = /^[A-Za-z]+/;
export const letters = new Parser<string>(
   (state: State<any>): State<string> => {
      const {index, target, result} = state;
      if (result.resType === ERR_RESULT) return state;
         
      const slicedTarget = target.slice(index);
      if (slicedTarget.length === 0)
      {
         const err = newErr(`letter: Unexpected end of input`);
         return updateError(state, err);
      }
      
      const regexMatch = slicedTarget.match(lettersRegex);
      if (regexMatch) {
         const res = newOk(newOne(regexMatch[0])); 
         return updateState<string>(state, index + regexMatch[0].length, res);
      } 

      const err = newErr(`letter: Couldn't match letters at index ${index}`);
      return updateError(state, err);
   });