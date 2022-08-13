import { useEffect } from 'react';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { useWeb3Context } from 'src/contexts/web3-context';

type Props = {
  proposalId: string;
};

export default function FetchData(props: Props) {
  const { fetch } = useDetailProposalContext();
  const { address, chain } = useWeb3Context();

  useEffect(() => {
    fetch(props.proposalId);
  }, [address, chain]);
  return <div />;
}
