import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';
import NetworkButton from 'src/components/NetworkButton';
import ToggleThemeButton from 'src/components/ToggleThemeButton';
import WalletButton from 'src/components/WalletButton';
import { useAppContext } from 'src/contexts/app-context';
import { buildPathToPublicResource } from 'src/utils';
// import AppsNavigation from './AppsNavigation';
import HeaderMenu from './HeaderMenu';

export default function Header() {
  const { mode } = useAppContext();

  return (
    <Box
      component="header"
      id="header"
      sx={{
        height: 55,
        width: '100%',
        position: { xsm: 'fixed' },
        top: 0,
        left: 0,
        bgcolor: 'background.paper',
        px: 2,
        borderBottomWidth: 1,
        borderBottomColor: 'divider',
        borderBottomStyle: 'solid',
        zIndex: 1201,
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box component="nav" aria-label="global navigation" sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <RouterLink to="/">
            <img
              src={buildPathToPublicResource(`images/logos/logo_${mode}_daas.png`)}
              alt="daas logo"
              width={120}
              style={{ display: 'block' }}
            />
          </RouterLink>
          {/* <Box sx={{ display: { xs: 'none', xsm: 'block' } }}>
            <AppsNavigation />
          </Box> */}
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <NetworkButton />
          </Box>
          <Box sx={{ mr: { md: 1 }, display: { xs: 'block', xsm: 'none', md: 'block' } }}>
            <WalletButton />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <ToggleThemeButton />
          </Box>
          <Box sx={{ display: { xs: 'none', xsm: 'block', md: 'none' } }}>
            <HeaderMenu />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
