import { Parser, Thunk, Result, State } from "./parser.model";

export function lazy<R = Result>(parserThunk: Thunk<R>): Parser<R> { 
   return new Parser<R>(
      (state: State<any>): State<R> => {
         const parser = parserThunk();
         return parser.parserStateTransfromerFn(state);
      }
   );
}
