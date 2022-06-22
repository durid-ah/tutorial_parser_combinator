import { sequenceOf } from "../collection_parsers/sequence-of.parser";
import { newOne } from "../models/result-cardinal.model";
import { newOk } from "../models/result.model";
import { bit } from "./bit.parser";


export function UInt(bitCount: number) {
   return sequenceOf(Array.from({length: bitCount}, () => bit()))
      .map<number>(bits => {
         const mappedResult = (bits.result.value as number[])
            .reduce((acc, bit, i) => acc + (bit << (bitCount - 1 -i)), 0);
         
         return newOk(newOne(mappedResult));
      });
}