import { Parser, sequenceOf } from ".";

export function between<L = string, R = string>(left: Parser<L>, right: Parser<R>) {
   return <C = string>(content: Parser<C>) => 
      sequenceOf<L | R | C>([left, content, right])
         .map(results => results[1]);
}