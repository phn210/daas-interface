import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { SnackbarKey, SnackbarProvider } from 'notistack';
import React from 'react';
import App from './App';
import ErrorNotifier from './components/ErrorNotifier';
import HighchartsGlobalConfig from './components/highcharts/HighchartsGlobalConfig';
import { isEnableTestnet } from './constants';
import { AppProvider } from './contexts/app-context';
import { CacheProvider } from './contexts/cache-context';
import { DAOsProvider } from './contexts/daos-context';
import { DAOProvider } from './contexts/dao-context';
import { ProposalsProvider } from './contexts/proposals-context';
import { Web3Provider } from './contexts/web3-context';
import { CHAIN_IDS } from './contexts/web3-context/chains';
import { DetailProposalProvider } from 'src/contexts/detail-proposal-context';

let allowedChainIds: number[] = [CHAIN_IDS.BSC_MAINNET, CHAIN_IDS.ETH_MAINNET];
if (isEnableTestnet) {
  allowedChainIds = allowedChainIds.concat([CHAIN_IDS.BSC_TESTNET, CHAIN_IDS.RINKEBY]);
}

const notistackRef = React.createRef<SnackbarProvider>();
const onClickDismiss = (key: SnackbarKey) => () => {
  notistackRef?.current?.closeSnackbar(key);
};

function Root() {
  return (
    <Web3Provider allowedChainIds={allowedChainIds} defaultChainId={allowedChainIds[0]} autoSwitchNetwork>
      <CacheProvider>
        <AppProvider>
          <SnackbarProvider
            maxSnack={3}
            ref={notistackRef}
            preventDuplicate
            action={(key) => (
              <IconButton size="small" color="inherit" onClick={onClickDismiss(key)}>
                <CloseIcon style={{ cursor: 'pointer' }} />
              </IconButton>
            )}
          >
            <DAOsProvider>
              <DAOProvider>
                <ProposalsProvider>
                  <DetailProposalProvider>
                    <HighchartsGlobalConfig />
                    <App />
                    <ErrorNotifier />
                  </DetailProposalProvider>
                </ProposalsProvider>
              </DAOProvider>
            </DAOsProvider>
          </SnackbarProvider>
        </AppProvider>
      </CacheProvider>
    </Web3Provider>
  );
}

export default Root;
