import { Result } from "./result.model"

/**
 * The parser's state
 * @typeparam `R` - result value type
 * @typeparam `E` - error value type
 * @typeparam `T` - the type of the target that needs to be parsed
 */
 export type State<R, E, T> = {
  index: number,
  target: T, 
  result: Result<R, E>
}