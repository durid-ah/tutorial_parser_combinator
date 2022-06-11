import { Parser, Thunk, State } from ".";

export function lazy<T, R, E>(parserThunk: Thunk<T, R, E>): Parser<T, R, E> { 
   return new Parser<T, R, E>(
      (state: State<T, E>): State<R, E> => {
         const parser = parserThunk();
         return parser.parserStateTransfromerFn(state);
      }
   );
}
