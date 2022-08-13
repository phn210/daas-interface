import { Box, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useState } from 'react';
import Moment from 'react-moment';
import BootstrapButton from 'src/components/primitives/BootstrapButton';
import { useDetailProposalContext } from 'src/contexts/detail-proposal-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import useNotifier from 'src/hooks/useNotifier';

type Props = {
  data: 'For' | 'Against';
  open: boolean;
  proposalId: string;
  startBlock: string;
  votingPower: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeModal: any;
};

export default function ConfirmModal(props: Props) {
  const { notifyError, notifySuccess } = useNotifier();
  const { fetch } = useDetailProposalContext();
  // const governorDelegateContract = useGovernorDelegateContract(true);
  const [loadingVote, setLoadingVote] = useState(false);
  const { address } = useWeb3Context();

  async function vote(proposalId: string, choice: 1 | 0) {
    setLoadingVote(true);
    try {
      // if (!address || !governorDelegateContract) {
      //   throw new Error('Wallet connection error');
      // }
      // await (await governorDelegateContract.castVote(proposalId, choice)).wait();
      // notifySuccess('Vote successfully');
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
          <span style={{ fontWeight: 'bold', color: props.data === 'For' ? '#03BD9D' : '#F06542' }}>{props.data}</span>
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
