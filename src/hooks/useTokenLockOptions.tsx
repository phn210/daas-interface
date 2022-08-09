import { tokenLockOptions } from 'src/configs/token-lock-options';
import { useWeb3Context } from 'src/contexts/web3-context';

export default function useTokenLockOptions() {
  const { chain } = useWeb3Context();

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return tokenLockOptions[chain!.chainId];
}
