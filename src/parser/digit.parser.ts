import { updateError, updateState } from "./parser.helper";
import { Parser, ParserState } from "./parser.model";

const digitsRegex = /^[0-9]+/;
export const digit = new Parser(
   (state: ParserState): ParserState => {
      const {index, target, isError} = state;
      if (isError) return state;
         
      const slicedTarget = target.slice(index);
      if (slicedTarget.length === 0)
         return updateError(state, `digit: Unexpected end of input`)
      
      const regexMatch = slicedTarget.match(digitsRegex);
      if (regexMatch) 
         return updateState(state, index + regexMatch.length, regexMatch[0]);
         
      return updateError(state, `digit: Couldn't match digits at index ${index}`);
   });