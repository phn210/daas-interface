import { Box, Button, Dialog, DialogContent, IconButton, TextField, Tooltip } from '@mui/material';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import React, { useMemo, useState } from 'react';
import BootstrapDialogTitle from '../primitives/BootstrapDialogTitle';
import { isAddress } from 'src/utils';

interface DevToolProps {
  mockAddress?: string;
  setMockAddress: (mockAddress?: string) => void;
}

export default function DevTool(props: DevToolProps) {
  const { mockAddress, setMockAddress } = props;
  const [isOpenDevToolDialog, setIsOpenDevToolDialog] = useState<boolean>(false);
  const [address, setAddress] = useState<string>(mockAddress ?? '');
  const isValidAddress = useMemo<boolean>(() => isAddress(address), [address]);

  const handleOpenDevTool = () => {
    setIsOpenDevToolDialog(true);
  };

  const handleCloseDevTool = () => {
    setIsOpenDevToolDialog(false);
  };

  const handleMockAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleUpdateMockAddress = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (isAddress(address)) {
      setMockAddress(address);
    }
  };

  const handleResetMockAddress = () => {
    setMockAddress(undefined);
    setAddress('');
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 8,
        left: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1500,
      }}
    >
      <Tooltip title={'Governance Dev Tools (enable only in development) - Try it now'}>
        <IconButton color="inherit" size="large" onClick={handleOpenDevTool}>
          <AssuredWorkloadIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Dialog open={isOpenDevToolDialog} onClose={handleCloseDevTool} maxWidth="sm" fullWidth>
        <BootstrapDialogTitle onClose={handleCloseDevTool}>DEV TOOLS</BootstrapDialogTitle>
        <DialogContent>
          <Box id="mock-address-section">
            <form onSubmit={handleUpdateMockAddress} noValidate>
              <TextField
                id="mock-address"
                margin="dense"
                placeholder="Enter address"
                label="Mock address"
                value={address}
                onChange={handleMockAddressChange}
                fullWidth
                helperText={isValidAddress ? undefined : 'Invalid address'}
                error={!isValidAddress}
              />
              <Box sx={{ display: 'flex', mt: 2 }}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isValidAddress || address === mockAddress}
                >
                  Update
                </Button>
                <Box px={1} />
                <Button fullWidth type="submit" variant="contained" color="error" onClick={handleResetMockAddress}>
                  Reset
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
