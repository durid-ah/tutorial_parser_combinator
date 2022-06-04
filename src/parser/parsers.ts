import { updateError, updateState } from "./parsers.helper";
import { Parser, State } from "./parser.model";
import { sequenceOf } from "./sequence-of.parser";

export const str = (s: string) => 
   new Parser<string>(
      (state: State<string>): State<string> => {
         const {index, target, isError} = state;
         if (isError) return state;
            
         const slicedTarget = target.slice(index);
         if (slicedTarget.length === 0)
            return updateError(state, `str: Tried to match ${s}, but got unexpected end of input`)
            
         if (slicedTarget.startsWith(s))
            return updateState(state, index + s.length, s);
            
         return updateError(state, `str: Tried to match ${s}, but got "${target.slice(index, index + 10)}"`);
      });

export const between = (left: Parser, right: Parser) => (content: Parser) => sequenceOf([
   left, content, right
]).map(results => results[1])