import { createTheme, CssBaseline, responsiveFontSizes, Theme, ThemeProvider, useMediaQuery } from '@mui/material';
import { deepmerge } from '@mui/utils';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { addressesConfig } from 'src/contracts/addresses';
import { getThemeConfig, getThemedComponent, THEME_MODE } from '../../utils/theme';
import { useWeb3Context } from '../web3-context';
import { CHAIN_IDS } from '../web3-context/chains';

export interface AppContextProps {
  toggleThemeMode: () => void;
  mode?: string;
  contractAddresses: { [name: string]: string };
  daoFactoryAddresses: { [chainId: number]: string }
}

const AppContext = createContext<AppContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleThemeMode: () => {},
  contractAddresses: {},
  daoFactoryAddresses: {}
});

export function AppProvider({ children }: { children: ReactNode }) {
  const { chain } = useWeb3Context();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<THEME_MODE>((): THEME_MODE => {
    let initialMode = localStorage.getItem('theme') as THEME_MODE;
    if (!initialMode) {
      initialMode = prefersDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', initialMode);
    }
    return initialMode;
  });

  const toggleThemeMode = useCallback(() => {
    setMode((prevMode: THEME_MODE) => {
      const newMode: THEME_MODE = prevMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  }, []);

  const theme = useMemo<Theme>(() => {
    const _t = createTheme(getThemeConfig(mode));
    return responsiveFontSizes(deepmerge(_t, getThemedComponent(_t)));
  }, [mode]);

  const contractAddresses = useMemo(() => {
    switch (chain?.chainId) {
      case CHAIN_IDS.BSC_MAINNET:
        return addressesConfig.BSC_MAINNET;
      case CHAIN_IDS.BSC_TESTNET:
        return addressesConfig.BSC_TESTNET;
      case CHAIN_IDS.RINKEBY:
        return addressesConfig.RINKEBY;
      case CHAIN_IDS.LOCALHOST:
        return addressesConfig.LOCALHOST;
      default:
        throw new Error('Failed to get contract addresses by chain.');
    }
  }, [chain]);
  
  const daoFactoryAddresses = {}
  Object.keys(CHAIN_IDS).map(key => {
    switch (key) {
      case 'BSC_MAINNET':
        Object.assign(daoFactoryAddresses, {[CHAIN_IDS.BSC_MAINNET]: addressesConfig.BSC_MAINNET});
        break;
      case 'BSC_TESTNET':
        Object.assign(daoFactoryAddresses, {[CHAIN_IDS.BSC_TESTNET]: addressesConfig.BSC_TESTNET});
        break;
      case 'RINKEBY':
        Object.assign(daoFactoryAddresses, {[CHAIN_IDS.RINKEBY]: addressesConfig.RINKEBY});
        break;
      case 'LOCALHOST':
        Object.assign(daoFactoryAddresses, {[CHAIN_IDS.LOCALHOST]: addressesConfig.LOCALHOST});
        break;
      default:
        break;
    }
  })

  return (
    <AppContext.Provider value={{ toggleThemeMode, mode, contractAddresses, daoFactoryAddresses }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
