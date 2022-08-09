import { Box, Theme, useMediaQuery } from '@mui/material';
import CreateLock from './CreateLock';
import Filters from './Filters';
import Merge from './Merge';

export default function VeTravaListActions() {
  const isXsScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('xsm'));

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>
        <CreateLock iconOnly={isXsScreen} sx={{ mr: { xs: 2, xsm: 4 } }} />
        <Merge iconOnly={isXsScreen} />
      </Box>
      <Box>
        <Filters iconOnly={isXsScreen} />
      </Box>
    </Box>
  );
}
