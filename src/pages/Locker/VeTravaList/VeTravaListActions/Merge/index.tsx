import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Dialog, DialogContent, Grid, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { Fragment, useMemo, useState } from 'react';
import BootstrapButton, { BootstrapButtonProps } from 'src/components/primitives/BootstrapButton';
import BootstrapDialogTitle from 'src/components/primitives/BootstrapDialogTitle';
import { useLockerContext } from 'src/contexts/locker-context';
import { VeNFT } from 'src/contexts/locker-context/types';
import { calcVotingPower } from 'src/contracts/utils';
import { useVeContract } from 'src/hooks/useContract';
import useNotifier from 'src/hooks/useNotifier';
import { MergeIcon } from 'src/icons';
import { BN, handleError } from 'src/utils';
import { useVeTravaListContext } from '../../context';
import { removeAllSelectedItems } from '../../reducer';
import VeNFTInfo from './VeNFTInfo';

enum MergeStep {
  DISABLED,
  SHOW,
  CONFIRM,
}

export default function Merge(props: BootstrapButtonProps) {
  // 2 veNFTs can be merged if they have same type (same locked token) and Locking status
  const { dispatch } = useVeTravaListContext();

  const [step, setStep] = useState<MergeStep>(MergeStep.DISABLED);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('xsm'));

  const { data, fetch: refreshLockerData } = useLockerContext();
  const { notifyError, notifySuccess } = useNotifier();
  const veContract = useVeContract(true);
  const {
    merge: { selectedItemIds },
  } = useVeTravaListContext();

  const selectedVeNFTs = useMemo<VeNFT[]>(() => {
    if (selectedItemIds.length < 2) return [];
    return [data.veNFTList[selectedItemIds[0]], data.veNFTList[selectedItemIds[1]]];
  }, [selectedItemIds, data.veNFTList]);

  const mergedVeNFT = useMemo<VeNFT | undefined>(() => {
    if (selectedVeNFTs.length < 2) return undefined;
    const [ve1, ve2] = selectedVeNFTs;
    if (!ve1 || !ve2) return undefined;
    // merge ve1 to ve2
    // mergedVeNFT will have same data with ve2, excepts some fields below
    // `amount`, `rewardAmount`, `balance` will be the sum of 2 veNFTs
    // `endTime` will be the maximum of endTime of 2 veNFTs
    // votingPower = total balance / max remaining time
    // NOTE: the ve1's claimable reward will be lost after merge
    const endTime = Math.max(ve1.endTime, ve2.endTime);
    const totalBalance = BN(ve1.balance).plus(ve2.balance).toString();
    return {
      ...ve2,
      endTime,
      votingPower: calcVotingPower(totalBalance, (endTime - new Date().getTime()) / 1000),
      amount: BN(ve1.amount).plus(ve2.amount).toString(),
      rewardAmount: BN(ve1.rewardAmount).plus(ve2.rewardAmount).toString(),
      balance: totalBalance,
    };
  }, [selectedVeNFTs]);

  const validateInputs = () => {
    if (selectedVeNFTs.some((veNFT: VeNFT) => veNFT.endTime < new Date().getTime())) {
      throw new Error('Cannot merge veTravaNFTs with Released status');
    }
    if (selectedVeNFTs.some((veNFT: VeNFT) => veNFT.token !== selectedVeNFTs[0].token)) {
      throw new Error('Cannot merge veTravaNFTs of different type');
    }
  };

  const handleOpenDialog = () => {
    try {
      validateInputs();
    } catch (error) {
      notifyError((error as Error).message);
      // make sure dialog closed
      setStep(MergeStep.DISABLED);
      return;
    }
    setStep(MergeStep.SHOW);
  };

  const handleCloseDialog = () => {
    setStep(MergeStep.DISABLED);
  };

  const handleOpenConfirmDialog = () => {
    setStep(MergeStep.CONFIRM);
  };

  const handleCloseConfirmDialog = () => {
    setStep(MergeStep.SHOW);
  };

  const handleMerge = async () => {
    setStep(MergeStep.SHOW);
    setIsMerging(true);
    try {
      if (!veContract) throw new Error('Connection error');
      await (await veContract.merge(selectedItemIds[0], selectedItemIds[1])).wait();
      setStep(MergeStep.DISABLED);
      notifySuccess('Merge successfully');
      dispatch(removeAllSelectedItems());
      refreshLockerData();
    } catch (error) {
      handleError(error, notifyError);
    }
    setIsMerging(false);
  };

  return (
    <Fragment>
      <BootstrapButton
        {...props}
        variant="contained"
        color="primary"
        startIcon={<MergeIcon />}
        onClick={handleOpenDialog}
        disabled={selectedItemIds.length < 2}
      >
        Merge
      </BootstrapButton>
      <Tooltip
        placement="top"
        title={'You can merge 2 veTravaNFTs together while preserving your voting power & rewards.'}
      >
        <HelpOutlineIcon color="secondary" sx={{ verticalAlign: 'middle', ml: 1 }} />
      </Tooltip>

      <Dialog open={step === MergeStep.SHOW} maxWidth="sm" fullWidth aria-labelledby="merge-veTravaNFT-dialog-title">
        <BootstrapDialogTitle id="merge-veTravaNFT-dialog-title" onClose={handleCloseDialog}>
          <Typography color="primary" variant="h4">
            Merge
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }} color="error.main" variant="body3">
            * The unclaimed reward will be lost when merge 2 veTravaNFTs
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={isMobile ? 12 : true}>
              {selectedVeNFTs[0] && <VeNFTInfo data={selectedVeNFTs[0]} />}
            </Grid>
            <Grid item xs={isMobile ? 12 : false}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'secondary.dark',
                    borderRadius: '50%',
                    width: 58,
                    height: 58,
                    bgcolor: 'background.secondary',
                  }}
                >
                  <MergeIcon fontSize="large" color="primary" sx={{ transform: isMobile ? 'rotate(90deg)' : 'none' }} />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={isMobile ? 12 : true}>
              {selectedVeNFTs[1] && <VeNFTInfo data={selectedVeNFTs[1]} />}
            </Grid>
          </Grid>
          <Box sx={{ width: 200, margin: 'auto', mt: 3 }}>
            <BootstrapButton
              fullWidth
              size="large"
              variant="contained"
              color="primary"
              onClick={handleOpenConfirmDialog}
              loading={isMerging}
              disabled={isMerging}
            >
              Merge
            </BootstrapButton>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={step === MergeStep.CONFIRM}
        maxWidth="xs"
        fullWidth
        aria-labelledby="confirm-merge-veTravaNFT-dialog-title"
      >
        <BootstrapDialogTitle id="confirm-merge-veTravaNFT-dialog-title" onClose={handleCloseDialog}>
          <Typography color="primary" variant="h4">
            Merge Result Preview
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent>
          {mergedVeNFT && <VeNFTInfo data={mergedVeNFT} />}
          <Box sx={{ display: 'flex', mt: 2 }}>
            <BootstrapButton fullWidth variant="outlined" color="primary" onClick={handleCloseConfirmDialog}>
              Cancel
            </BootstrapButton>
            <Box px={2} />
            <BootstrapButton fullWidth variant="contained" color="primary" onClick={handleMerge}>
              Confirm
            </BootstrapButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
