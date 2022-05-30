import { updateError, updateState } from "./parsers.helper";
import { Parser, ParserState } from "./parser.model";

const lettersRegex = /^[A-Za-z]+/;
export const letters = new Parser(
   (state: ParserState): ParserState => {
      const {index, target, isError} = state;
      if (isError) return state;
         
      const slicedTarget = target.slice(index);
      if (slicedTarget.length === 0)
         return updateError(state, `letter: Unexpected end of input`)
      
      const regexMatch = slicedTarget.match(lettersRegex);
      if (regexMatch) 
         return updateState(state, index + regexMatch[0].length, regexMatch[0]);

      return updateError(state, `letter: Couldn't match letters at index ${index}`);
   });