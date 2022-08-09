import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import { alpha, Box, Drawer, Link, List, ListItem, Theme, Typography } from '@mui/material';
import clsx from 'clsx';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import NavLink from 'src/components/primitives/NavLink';
import { internalNavs } from 'src/configs/navigations';

export default function Sidebar() {
  const location = useLocation();

  return (
    <Fragment>
      <Drawer
        variant="permanent"
        PaperProps={{
          sx: {
            width: { xs: 80, md: 220 },
            transition: 'width 300ms ease',
            pt: 10,
          },
        }}
      >
        <Box component="nav" aria-label="sidebar navigation">
          <List>
            {internalNavs.map((nav) => {
              const Anchor = (nav.isExternalLink ? Link : NavLink) as React.ElementType;
              const IconTag = nav.Icon;

              return (
                <ListItem key={nav.id} sx={{ py: 0.5 }}>
                  <Anchor
                    className=
                      {clsx({
                      active:
                        nav.navLink === location.pathname ||
                        (nav.activePattern && new RegExp(nav.activePattern).test(location.pathname)),
                      })}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'secondary.main',
                      textDecoration: 'none',
                      width: '100%',
                      px: { xs: 1, md: 2 },
                      py: 1,
                      borderRadius: '5px',
                      transition: 'background-color 250ms ease',
                      '& .external-link-icon': {
                        display: 'none',
                      },
                      '&.active': {
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        boxShadow: (theme: Theme) => `0 0 10px 1px ${alpha(theme.palette.primary.main, 0.6)}`,
                      },
                      '&:not(.active):hover': {
                        bgcolor: 'action.hover',
                        '& .external-link-icon': {
                          display: { md: 'inline-block' },
                        },
                      },
                      '& .MuiTypography-root': {
                        flexGrow: 1,
                        display: { xs: 'none', md: 'block' },
                      },
                    }}
                    {...(nav.isExternalLink
                      ? {
                          href: nav.navLink,
                          target: '_blank',
                          rel: 'noreferrer noopener',
                        }
                      : {
                          // to: nav.navLink,
                          to: `.${nav.navLink}`,
                          activeClassName: 'active',
                          exact: nav.exact,
                        })}
                  >
                    <Box sx={{ width: { md: 36 } }}>
                      <IconTag style={{ verticalAlign: 'middle' }} />
                    </Box>
                    <Typography variant="button">{nav.title}</Typography>
                    {nav.isExternalLink && <LaunchOutlinedIcon className="external-link-icon" />}
                  </Anchor>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </Fragment>
  );
}
