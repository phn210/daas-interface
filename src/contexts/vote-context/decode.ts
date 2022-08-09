/* eslint-disable @typescript-eslint/no-explicit-any */
import { BigNumberish } from 'src/global';
import { BN } from 'src/utils';

interface DefinitionType {
  name: string;
  type: string;
  size: number;
  isTime?: boolean;
}

function decodeNum(data: string, toNum = false): BigNumberish {
  return toNum ? BN(data).toNumber() : BN(data).toFixed();
}

function decodePackedStruct(data: Array<string>, definitions: DefinitionType[]) {
  const obj: { [key: string]: any } = {};
  let slot = 0;
  let c = 0;
  try {
    for (let i = 0; i != definitions.length; i++) {
      const def = definitions[i];
      if (c + def.size > 256) {
        slot++;
        c = 0;
      }

      let hex: any =
        '0x' + data[slot].slice(data[slot].indexOf('0x') == 0 ? 2 : 0).slice(-(c + def.size) / 4, (256 - c) / 4);
      c += def.size;

      if (def.type == 'uint') {
        hex = decodeNum(hex, def.size <= 48);
        if (def.isTime) hex = hex != 0 ? BN(hex).times(1000).toNumber() : null;
      } else if (def.type == 'bool') {
        hex = decodeNum(hex, true) === 1;
      }

      obj[def.name] = hex;
    }
  } catch (e) {
    console.warn('decodePacked:', (e as Error).message);
  }
  return obj;
}

function decodeProposalList(data: Array<string>) {
  const definitions: DefinitionType[] = [
    { name: 'id', type: 'uint', size: 256 },
    { name: 'forVotes', type: 'uint', size: 128 },
    { name: 'againstVotes', type: 'uint', size: 128 },
    { name: 'proposer', type: 'address', size: 160 },
    { name: 'startBlock', type: 'uint', size: 64 },
    { name: 'duration', type: 'uint', size: 32 },
    { name: 'eta', type: 'uint', size: 32 },
    { name: 'cancelled', type: 'bool', size: 8 },
    { name: 'executed', type: 'bool', size: 8 },
  ];

  return decodePackedStruct(data, definitions);
}

export { decodeProposalList };
