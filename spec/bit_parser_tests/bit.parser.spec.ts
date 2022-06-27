import { Many, Parser } from "../../src/parser";
import { Bit } from "../../src/parser/bit_parsers/bit.parser";
import { Cardinal } from "../../src/parser/models/result-cardinal.model";
import { mapErr, newErr, ResOk, Result, ResultType } from "../../src/parser/models/result.model";
import { State } from "../../src/parser/models/state.model";

describe('Bit Parser Tests', () => {
   const parser = Bit();

   it('Should get all the bits in the DataView', () =>{
      const data = new DataView((new Uint8Array([234, 128])).buffer);
      const res = parser.run(data);
      console.log(JSON.stringify((Many(parser).run(data).result as ResOk<number>).result.value))
      console.log([(234).toString(2), (128).toString(2)])

   });
});

const otherBit = new Parser<number,number,DataView,string>(
   (state: State<number, string,DataView>): State<number,string,DataView> => {
      if (state.result.resType === ResultType.Error)
         return mapErr(state);

      
      const byteOffset = Math.floor(state.index/ 8);

      if (byteOffset >= state.target.byteLength)
         return {...state, result: newErr(`Bit: Unexpected end of input`)};
      
      const byte = state.target.getUint8(byteOffset);

      // To get the right most number the '7 -' should be removed
      const bitOffset = (state.index % 8);
      const result = (byte & 1 << bitOffset) >> bitOffset;
      const res: Result<number, string> = {
         resType: ResultType.Ok, 
         result: { resType: Cardinal.One, value: result }
      };

      return {...state, index: state.index + 1, result: res};          
   });

// /**
//  * A parser that gets the bits from a DataView
//  */
// export function Bit<R>() {
//    return new Parser<R,number,DataView,string>(
//       (state: State<R, string,DataView>): State<number,string,DataView> => {
//          if (state.result.resType === ResultType.Error)
//             return mapErr(state);

         
//          const byteOffset = Math.floor(state.index/ 8);

//          if (byteOffset >= state.target.byteLength)
//             return {...state, result: newErr(`Bit: Unexpected end of input`)};
         
//          const byte = state.target.getUint8(byteOffset);

//          // To get the right most number the '7 -' should be removed
//          const bitOffset = 7 - (state.index % 8);
//          const result = (byte & 1 << bitOffset) >> bitOffset;
//          const res: Result<number, string> = {
//             resType: ResultType.Ok, 
//             result: { resType: Cardinal.One, value: result }
//          };

//          return {...state, index: state.index + 1, result: res};          
//       });
// }
