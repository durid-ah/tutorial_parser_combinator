import { Parser, State, updateError, updateState } from ".";

export function str(s: string) { 
   return new Parser<string>(
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
}