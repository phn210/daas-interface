import { useCacheContext } from 'src/contexts/cache-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { Bep20, Bep20__factory } from 'src/contracts/typechain';
import { EthersBigNumber, TokenMeta } from 'src/global';
import { useMulticall } from './multicall';
import { useContractGetter } from './useContract';
import { BN } from 'src/utils';

export default function useHelperFunctions() {
  const getContract = useContractGetter();
  const { address } = useWeb3Context();
  const { select, push } = useCacheContext();
  const multicall = useMulticall();

  const getToken = async (tokenAddress: string): Promise<TokenMeta> => {
    const path = `tokens.${String(tokenAddress).toLowerCase()}`;
    let token = select(path);
    if (token === undefined) {
      const bep20Interface = Bep20__factory.createInterface();
      const { data } = await multicall.default([
        {
          interface: Bep20__factory.createInterface(),
          calls: [
            { target: tokenAddress, method: bep20Interface.getFunction('name') },
            { target: tokenAddress, method: bep20Interface.getFunction('symbol') },
            { target: tokenAddress, method: bep20Interface.getFunction('decimals') },
          ],
        },
      ]);
      if (data) {
        token = {
          name: data[0][0][0],
          symbol: data[0][1][0],
          decimals: data[0][2][0],
        };
        push(path, token);
      }
    }
    return token;
  };

  const handleTokenApprove = async (
    tokenAddress: string,
    spender: string,
    spendAmount: string | number,
    approveAmount: string | number
  ) => {
    const tokenContract = getContract<Bep20>(tokenAddress, Bep20__factory.connect, true) as Bep20;
    const [tokenMeta, allowance] = await Promise.all([
      getToken(tokenAddress),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      tokenContract.allowance(address!, spender),
    ]);
    const BASE = BN(10).pow(tokenMeta.decimals);
    if (BN((allowance as EthersBigNumber)._hex).lt(BN(spendAmount).times(BASE))) {
      // spend amount exceeds allowance, need to approve more tokens
      const tx = await tokenContract.approve(spender, BN(approveAmount).times(BASE).toFixed(0));
      await tx.wait();
    }
  };

  return {
    getToken,
    handleTokenApprove,
  };
}
