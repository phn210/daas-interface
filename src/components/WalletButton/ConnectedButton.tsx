/* eslint-disable @typescript-eslint/no-non-null-assertion */
import LaunchIcon from '@mui/icons-material/Launch';
import { Box, Button, ButtonProps, Dialog, DialogContent, Link, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import { useWeb3Context } from 'src/contexts/web3-context';
import { CONNECTOR_TYPES, getStoredConnector } from 'src/contexts/web3-context/utils';
import { WalletIcon } from 'src/icons';
import { formatAddress } from 'src/utils/format';
import CopyButton from '../CopyButton';
import BootstrapDialogTitle from '../primitives/BootstrapDialogTitle';

export default function ConnectedButton(props: ButtonProps) {
  const { address, getAddressExplorerLink, disconnect } = useWeb3Context();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getConnectedWith = () => {
    const storedConnector = getStoredConnector();
    if (storedConnector === CONNECTOR_TYPES.METAMASK) {
      return 'MetaMask';
    } else if (storedConnector === CONNECTOR_TYPES.WALLET_CONNECT) {
      return 'WalletConnect';
    }
    return null;
  };

  return (
    <Fragment>
      <Button variant="gradient" {...props} onClick={() => setIsOpen(!isOpen)} startIcon={<WalletIcon />}>
        {formatAddress(address!)}
      </Button>

      <Dialog open={isOpen} PaperProps={{ elevation: 0, sx: { maxWidth: 350 } }} fullWidth>
        <BootstrapDialogTitle onClose={() => setIsOpen(false)}>Wallet connection</BootstrapDialogTitle>

        <DialogContent>
          <Typography variant="body3" color="text.secondary" gutterBottom>
            Connected with {getConnectedWith()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6">{formatAddress(address!)}</Typography>
            <CopyButton text={address!} />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link variant="body3" href={getAddressExplorerLink(address!)} target="_blank" rel="noreferrer noopener">
              View on Explorer <LaunchIcon fontSize="small" sx={{ verticalAlign: 'middle' }} />
            </Link>
            <Button variant="outlined" color="error" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
