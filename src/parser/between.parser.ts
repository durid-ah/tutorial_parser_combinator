import { Parser, sequenceOf } from ".";

export function between(left: Parser, right: Parser) {
   return (content: Parser) => 
      sequenceOf([left, content, right])
         .map(results => results[1]);
}