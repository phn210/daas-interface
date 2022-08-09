import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link, List, ListItem, Popover, Typography } from '@mui/material';
import { SyntheticEvent, useMemo, useState } from 'react';
import { appNavs } from 'src/configs/navigations';
import { AnchorElType } from 'src/global';

export default function AppsNavigation() {
  const [moreAnchorEl, setMoreAnchorEl] = useState<AnchorElType>(null);

  const { displayNavs, collapsibleNavs } = useMemo(() => {
    return {
      displayNavs: appNavs.filter((nav) => !nav.collapsible),
      collapsibleNavs: appNavs.filter((nav) => nav.collapsible),
    };
  }, []);

  const handleOpenMorePopover = (ev: SyntheticEvent) => {
    setMoreAnchorEl(ev.currentTarget);
  };

  const handleCloseMorePopover = () => {
    setMoreAnchorEl(null);
  };

  const openMorePopover = Boolean(moreAnchorEl);

  return (
    <List sx={{ display: 'flex', ml: 3 }}>
      {displayNavs.map((nav) => {
        return (
          <ListItem key={nav.id} sx={{ width: 'auto', px: 1.5 }}>
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
      {collapsibleNavs !== undefined && (
        <ListItem sx={{ width: 'auto', px: 1.5 }}>
          <Typography
            aria-describedby={openMorePopover ? 'navigation-more' : undefined}
            variant="button"
            sx={{
              color: openMorePopover ? 'text.primary' : 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={handleOpenMorePopover}
          >
            More <MoreHorizIcon fontSize="medium" />
          </Typography>
          <Popover
            id={openMorePopover ? 'navigation-more' : undefined}
            open={openMorePopover}
            anchorEl={moreAnchorEl}
            elevation={2}
            onClose={handleCloseMorePopover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <List>
              {collapsibleNavs.map((nav) => (
                <ListItem key={nav.id} sx={{ width: 'auto', px: 2, py: 1.5 }}>
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
              ))}
            </List>
          </Popover>
        </ListItem>
      )}
    </List>
  );
}
