import { updateError, updateState } from "./parsers.helper";
import { Parser, State } from "./parser.model";

const lettersRegex = /^[A-Za-z]+/;
export const letters = new Parser<string>(
   (state: State<any>): State<string> => {
      const {index, target, isError} = state;
      if (isError) return state;
         
      const slicedTarget = target.slice(index);
      if (slicedTarget.length === 0)
         return updateError(state, `letter: Unexpected end of input`)
      
      const regexMatch = slicedTarget.match(lettersRegex);
      if (regexMatch) 
         return updateState<string>(state, index + regexMatch[0].length, regexMatch[0]);

      return updateError(state, `letter: Couldn't match letters at index ${index}`);
   });