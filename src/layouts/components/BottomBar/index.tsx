import MenuIcon from '@mui/icons-material/Menu';
import { Box, Link, List, ListItem, Paper, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavLink from 'src/components/primitives/NavLink';
import { internalNavs } from 'src/configs/navigations';
import BottomMenu from './BottomMenu';

export default function BottomBar() {
  const location = useLocation();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);

  const handleCloseMenu = () => {
    setIsOpenMenu(false);
  };

  const toggleMenu = () => {
    setIsOpenMenu(!isOpenMenu);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1201,
        borderTopWidth: 1,
        borderTopColor: 'divider',
        borderTopStyle: 'solid',
        borderRadius: 0,
      }}
      elevation={0}
    >
      <Box component={'nav'}>
        <List disablePadding sx={{ display: 'flex' }}>
          {internalNavs.map((nav) => {
            const Anchor = (nav.isExternalLink ? Link : NavLink) as React.ElementType;
            const IconTag = nav.Icon;

            return (
              <ListItem key={nav.id} sx={{ flexGrow: 1, p: 0 }}>
                <Anchor
                  className={clsx({
                    active:
                      nav.navLink === location.pathname ||
                      (nav.activePattern && new RegExp(nav.activePattern).test(location.pathname)),
                  })}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'secondary.main',
                    textDecoration: 'none',
                    width: '100%',
                    px: 1,
                    py: 1,
                    '&.active': {
                      color: 'primary.main',
                    },
                    '&:not(.active):hover': {
                      bgcolor: 'action.hover',
                    },
                    '& .MuiTypography-root': {
                      // display: { xs: 'none' },
                    },
                  }}
                  {...(nav.isExternalLink
                    ? {
                        href: nav.navLink,
                        target: '_blank',
                        rel: 'noreferrer noopener',
                      }
                    : {
                        to: nav.navLink,
                        activeClassName: 'active',
                        exact: nav.exact,
                      })}
                >
                  <IconTag sx={{ verticalAlign: 'middle', mb: 0.5 }} />
                  <Typography variant="button">{nav.title}</Typography>
                </Anchor>
              </ListItem>
            );
          })}

          <ListItem
            onClick={toggleMenu}
            sx={{
              pl: 1,
              pr: 2,
              width: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isOpenMenu ? 'text.primary' : 'secondary.main',
              cursor: 'pointer',
            }}
          >
            <MenuIcon sx={{ mb: 0.5 }} />
            <Typography variant="button">Menu</Typography>
          </ListItem>
          <BottomMenu open={isOpenMenu} onClose={handleCloseMenu} elevation={0} />
        </List>
      </Box>
    </Paper>
  );
}
