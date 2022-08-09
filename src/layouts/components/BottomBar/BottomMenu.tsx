import { Box, Divider, Drawer, DrawerProps, Link, List, ListItem, Theme, Typography } from '@mui/material';
import NetworkButton from 'src/components/NetworkButton';
import ToggleThemeButton from 'src/components/ToggleThemeButton';
import { appNavs } from 'src/configs/navigations';
import { useAppContext } from 'src/contexts/app-context';

export default function BottomMenu(props: DrawerProps) {
  const { mode } = useAppContext();

  return (
    <Drawer
      anchor={'right'}
      variant={'temporary'}
      sx={{
        zIndex: 0,
      }}
      PaperProps={{
        sx: {
          height: '70%',
          maxHeight: 360,
          width: '200px',
          top: 'auto',
          bottom: (theme: Theme) => theme.spacing(7),
          px: 2,
          py: 2,
          borderTopLeftRadius: 4,
          '& $navLink': {
            fontWeight: 450,
          },
        },
      }}
      {...props}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <List sx={{ flexGrow: 1 }} disablePadding>
          {appNavs.map((nav) => {
            return (
              <ListItem key={nav.id} sx={{ width: 'auto', py: 1.25, px: 0 }}>
                <Link
                  variant="button"
                  sx={{
                    textDecoration: 'none',
                    color: nav.isActive ? 'primary.main' : 'text.secondary',
                    '&:hover': {
                      color: nav.isActive ? 'primary.main' : 'text.primary',
                    },
                  }}
                  href={nav.url}
                  {...(nav.isExternalLink
                    ? {
                        target: '_blank',
                        rel: 'noreferrer noopener',
                      }
                    : {})}
                >
                  {nav.title}
                </Link>
              </ListItem>
            );
          })}
        </List>
        <Box sx={{ pt: 1, pb: 2 }}>
          <Divider />
          <Box pt={2}>
            <NetworkButton fullWidth />
          </Box>
          <Box sx={{ pt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>{mode === 'dark' ? 'Dark' : 'Light'} mode</Typography>
            <ToggleThemeButton />
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
