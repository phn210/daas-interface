import { Button, ButtonProps } from '@mui/material';
import { Fragment } from 'react';
import { useWeb3Context } from 'src/contexts/web3-context';

export default function NetworkButton(props: ButtonProps) {
  const { chain } = useWeb3Context();

  if (!chain) return null;

  return (
    <Fragment>
      <Button variant="outlined" color="primary" {...props}>
        {chain.name}
      </Button>
    </Fragment>
  );
}

NetworkButton.defaultProps = {
  sx: {
    // fontWeight: 400,
  },
};
