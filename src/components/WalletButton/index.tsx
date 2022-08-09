import { ButtonProps } from '@mui/material';
import { Fragment } from 'react';
import { useWeb3Context } from 'src/contexts/web3-context';
import ConnectButton from './ConnectButton';
import ConnectedButton from './ConnectedButton';

export default function WalletButton(props: ButtonProps) {
  const { address } = useWeb3Context();

  return <Fragment>{address ? <ConnectedButton {...props} /> : <ConnectButton {...props} />}</Fragment>;
}

WalletButton.defaultProps = {
  sx: {
    // fontWeight: 400,
  },
};
