import { Box, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useState } from 'react';
import Moment from 'react-moment';
import BootstrapButton from 'src/components/primitives/BootstrapButton';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { useGovernorContract } from 'src/hooks/useContract';
import useNotifier from 'src/hooks/useNotifier';

type Props = {
  data: 'For' | 'Against' | 'Abstain';
  open: boolean;
  proposalId: string;
  startBlock: number;
  votingPower: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeModal: any;
};

export default function ConfirmModal(props: Props) {
  const { notifyError, notifySuccess } = useNotifier();
  const { data, fetch } = useDetailProposalContext();
  const governorContract = useGovernorContract(data.governor, true);
  const [loadingVote, setLoadingVote] = useState(false);
  const { address } = useWeb3Context();

  const color = (type: 'For' | 'Against' | 'Abstain') => {
    switch (type) {
      case 'For':
        return 'rgba(104, 221, 201, 1)';
      case 'Against':
        return 'rgba(179, 157, 219, 1)';
      case 'Abstain':
        return 'rgba(180, 180, 180, 1)';
    }
  }

  async function vote(proposalId: string, choice: 0 | 1 | 2) {
    setLoadingVote(true);
    try {
      if (!address || !governorContract) {
        throw new Error('Wallet connection error');
      }
      console.log(data.id);
      await (await governorContract.castVote(data.id, choice)).wait();
      notifySuccess('Vote successfully');
      fetch(props.proposalId);
    } catch (error) {
      // console.error('Failed to call vote function: ', error);
      notifyError('Vote fail! ' + (error as Error).message);
    }
    setLoadingVote(false);
  }
  const handleClose = () => {
    props.closeModal();
  };
  async function onVoteAction() {
    if (props.data == 'For') {
      await vote(props.proposalId, 1);
    } else if (props.data == 'Abstain') {
      await vote(props.proposalId, 2);
    } else {
      await vote(props.proposalId, 0);
    }

    handleClose();
  }
  return (
    <Dialog
      open={props.open}
      onClose={
        loadingVote
          ? () => {
              return;
            }
          : handleClose
      }
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle style={{ fontWeight: 700 }}>Confirm to cast this vote</DialogTitle>
      <DialogContent sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <span>Checkpoint</span>
          <span>
            <Moment date={Date.now()} format="MMMM Do yyyy, hh:mm A" />
          </span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <span>Voting Power</span>
          <span>{props.votingPower}</span>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <span>Option</span>
          <span style={{ fontWeight: 'bold', color: color(props.data) }}>{props.data}</span>
        </Box>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <BootstrapButton
              loading={loadingVote}
              disabled={loadingVote}
              variant="contained"
              color="secondary"
              fullWidth
              onClick={handleClose}
            >
              Cancel
            </BootstrapButton>
          </Grid>
          <Grid item xs={6}>
            <BootstrapButton
              loading={loadingVote}
              disabled={loadingVote}
              variant="contained"
              color="primary"
              fullWidth
              onClick={onVoteAction}
            >
              Confirm
            </BootstrapButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
