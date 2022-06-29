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
   });
});



