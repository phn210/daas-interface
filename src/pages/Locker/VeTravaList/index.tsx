import CastConnectedIcon from '@mui/icons-material/CastConnected';
import { Box, Button, Typography } from '@mui/material';
import Failed from 'src/components/Failed';
import Loading from 'src/components/Loading';
import { FetchingStatus } from 'src/constants';
import { useLockerContext } from 'src/contexts/locker-context';
import { useWeb3Context } from 'src/contexts/web3-context';
import { getErrorMessage } from 'src/utils';
import { VeTravaListProvider } from './context';
import VeList from './VeList';
import VeTravaListActions from './VeTravaListActions';

export default function VeTravaList() {
  const { address, activating } = useWeb3Context();
  const { status, error, fetch } = useLockerContext();

  return (
    <VeTravaListProvider>
      <Box mt={3}>
        <VeTravaListActions />
        <Box mt={2}>
          {address ? (
            <>
              {(status === FetchingStatus.IDLE || status === FetchingStatus.FETCHING || activating) && (
                <Box textAlign={'center'} py={4}>
                  <Loading size={50} />
                  <Typography color="text.secondary">Please wait a moment...</Typography>
                </Box>
              )}
              {status === FetchingStatus.FAILED && (
                <Failed title="Failed to fetch data" detail={getErrorMessage(error)}>
                  <Button variant="contained" color="primary" sx={{ px: 3 }} onClick={() => fetch()}>
                    Reload
                  </Button>
                </Failed>
              )}
              {(status === FetchingStatus.SUCCESS || status === FetchingStatus.UPDATING) && <VeList />}
            </>
          ) : (
            <Box textAlign="center" py={3}>
              <CastConnectedIcon fontSize="large" color="secondary" />
              <Typography color="secondary">Please connect your wallet!</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </VeTravaListProvider>
  );
}
