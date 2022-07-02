import { Parser } from "./models/parser.model";
import { newErr } from "./models/result.model";
import { State } from "./models/state.model";

export function Fail<R1, R2, T, E>(errorMsg: E) {
   return new Parser<R1,R2,T,E>(
      (state: State<R1, E, T>): State<R2, E, T> => {
         return {
            ...state,
            result: newErr(errorMsg)
         }
      }
   )
}