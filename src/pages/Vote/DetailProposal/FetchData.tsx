import { useEffect } from 'react';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { useWeb3Context } from 'src/contexts/web3-context';

type Props = {
  idProposal: string;
  startBlock: string;
};

export default function FetchData(props: Props) {
  const { fetch } = useDetailProposalContext();
  const { address, chain } = useWeb3Context();

  useEffect(() => {
    fetch(props.idProposal, props.startBlock);
  }, [address, chain]);
  return <div />;
}
