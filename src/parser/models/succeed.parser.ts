import { Parser } from "./parser.model"
import { ResultCardinal } from "./result-cardinal.model"
import { newOk } from "./result.model"
import { State } from "./state.model"


export function Succeed<R, T, E>(value: ResultCardinal<R>) {
   return new Parser<R,R,T,E>(
      (state: State<R, E, T>): State<R, E, T> => {
         return {
            ...state,
            result: newOk(value)
         }
      }
   )
}