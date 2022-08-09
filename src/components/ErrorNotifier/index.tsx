import { useEffect } from 'react';
import { useWeb3Context } from 'src/contexts/web3-context';
import useNotifier from 'src/hooks/useNotifier';

export default function ErrorNotifier() {
  const { error } = useWeb3Context();
  const { notifyError } = useNotifier();

  useEffect(() => {
    if (error instanceof Error) {
      notifyError(error.message);
    }
  }, [error]);

  return null;
}
