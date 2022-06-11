import { Parser, sequenceOf } from ".";

export function between<T, R, E>(left: Parser<T, R, E>, right: Parser<T,R,E>) {
   return (content: Parser<T, R, E>) => 
      sequenceOf<T, R, E>([left, content, right])
         .map<R>(results => results[1]);
}