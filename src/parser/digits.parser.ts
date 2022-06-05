import { updateError, updateState, Parser, State } from ".";

const digitsRegex = /^[0-9]+/;
export const digits = new Parser<string>(
   (state: State<any>): State<string> => {
      const {index, target, isError} = state;
      if (isError) return state;
         
      const slicedTarget = target.slice(index);
      if (slicedTarget.length === 0)
         return updateError(state, `digit: Unexpected end of input`)
      
      const regexMatch = slicedTarget.match(digitsRegex);
      if (regexMatch) 
         return updateState(state, index + regexMatch[0].length, regexMatch[0]);
         
      return updateError(state, `digit: Couldn't match digits at index ${index}`);
   });