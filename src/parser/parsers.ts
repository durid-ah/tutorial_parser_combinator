import { updateError, updateState } from "./parsers.helper";
import { Parser, ParserState } from "./parser.model";

export const str = (s: string) => 
   new Parser(
      (state: ParserState): ParserState => {
         const {index, target, isError} = state;
         if (isError) return state;
            
         const slicedTarget = target.slice(index);
         if (slicedTarget.length === 0)
            return updateError(state, `str: Tried to match ${s}, but got unexpected end of input`)
            
         if (slicedTarget.startsWith(s))
            return updateState(state, index + s.length, s);
            
         return updateError(state, `str: Tried to match ${s}, but got "${target.slice(index, index + 10)}"`);
      });
