import { Box } from '@mui/material';
import { Fragment } from 'react';

interface Props {
  children: React.ReactElement;
}

export default function BlankLayout(props: Props) {
  const { children } = props;

  return (
    <Fragment>
      <Box component={'main'}>{children}</Box>
    </Fragment>
  );
}
