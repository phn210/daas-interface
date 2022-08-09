/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { BigNumberish, BytesLike } from 'ethers';
import { useMemo } from 'react';
import { useMulticallContract } from './useContract';

type MethodArg = string | BigNumberish;
type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined;
type Call = {
  target: string;
  method: FunctionFragment | string;
  params?: OptionalMethodInputs;
};
interface MulticallArg {
  interface: Interface;
  calls: Call[];
}

export function useMulticall() {
  const contract = useMulticallContract();

  return useMemo(
    () => ({
      default: async (args: MulticallArg[]) => {
        const _calls = args.reduce<{ target: string; callData: BytesLike }[]>((acc, arg) => {
          return acc.concat(
            arg.calls.map((c) => ({
              target: c.target,
              callData: arg.interface.encodeFunctionData(c.method, c.params),
            }))
          );
        }, []);

        const result = await contract!.aggregate(_calls);

        const returnData = result.returnData;
        let i = 0;
        const out = args.reduce<Array<any>>((acc, arg) => {
          acc.push(arg.calls.map((call) => arg.interface.decodeFunctionResult(call.method, returnData[i++])));
          return acc;
        }, []);

        return {
          blockNumber: result.blockNumber.toNumber(),
          data: out,
        };
      },
    }),
    [contract]
  );
}
