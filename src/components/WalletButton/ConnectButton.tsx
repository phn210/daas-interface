/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  ButtonProps,
  Dialog,
  DialogContent,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Fragment, useState } from 'react';
import { useWeb3Context } from 'src/contexts/web3-context';
import { WalletIcon } from 'src/icons';
import { buildPathToPublicResource } from 'src/utils';
import BootstrapDialogTitle from '../primitives/BootstrapDialogTitle';

export default function ConnectButton(props: ButtonProps) {
  const { connectMetaMask, connectWalletConnect } = useWeb3Context();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleConnectMetaMask = async () => {
    await connectMetaMask();
  };

  const handleConnectWalletConnect = async () => {
    await connectWalletConnect();
  };

  return (
    <Fragment>
      <Button variant="gradient" {...props} onClick={() => setIsOpen(!isOpen)} startIcon={<WalletIcon />}>
        Connect wallet
      </Button>

      <Dialog open={isOpen} maxWidth="xs">
        <BootstrapDialogTitle onClose={() => setIsOpen(false)}>
          <Typography variant="h5" align="center" gutterBottom>
            Choose Wallet
          </Typography>
          <Typography variant="body3" align="center" color="text.secondary">
            Safely connect to your existing blockchain wallet and directly stake tokens in them.
          </Typography>
        </BootstrapDialogTitle>

        <DialogContent>
          <List sx={{ display: 'flex', py: 2 }}>
            <ListItem
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 1 }}
              button
              onClick={handleConnectMetaMask}
              disabled={!window.ethereum}
            >
              <Box height={80} display="flex" alignItems="center">
                <img src={buildPathToPublicResource('images/icons/metamask.png')} width={60} alt="metamask" />
              </Box>
              <ListItemText>MetaMask</ListItemText>
            </ListItem>

            <ListItem
              sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 1 }}
              button
              onClick={handleConnectWalletConnect}
            >
              <Box height={80} display="flex" alignItems="center">
                <img
                  src={buildPathToPublicResource('images/icons/wallet-connect.png')}
                  alt="wallet-connect"
                  width={65}
                />
              </Box>
              <ListItemText>WalletConnect</ListItemText>
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}
