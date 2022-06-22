import { Parser } from ".";
import { State } from "./models/state.model";


/** A function type to lazy create a parser */
export type Thunk<R1, R2, T, E> = () => Parser<R1, R2, T, E>;

/** A lazy executed parser */
export function Lazy<R1, R2, T, E>(parserThunk: Thunk<R1, R2, T, E>) { 
   return new Parser<R1, R2, T, E>(
      (state: State<R1, E, T>): State<R2, E, T> => {
         const parser = parserThunk();
         return parser.parserStateTransfromerFn(state);
      }
   );
}
