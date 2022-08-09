import { CheckBox } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { List, ListItem, Popover, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { SyntheticEvent, useState } from 'react';
import BootstrapButton, { BootstrapButtonProps } from 'src/components/primitives/BootstrapButton';
import { useVeTravaListContext } from '../context';
import { addFilterStatuses, addFilterTokens, removeFilterStatuses, removeFilterTokens } from '../reducer';

export default function Filters(props: BootstrapButtonProps) {
  const { dispatch, filter } = useVeTravaListContext();
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);

  const handleClick = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const dataFilterTokens = [
    {
      title: 'Tokens',
      data: ['TRAVA', 'rTRAVA', 'TRAVA/BNB'],
    },
  ];
  const dataFilterStatuses = [
    {
      title: 'Status',
      data: ['Locked', 'Released'],
    },
  ];

  const handleSelectTokens = (item: string) => {
    if (filter.tokens.includes(item)) {
      dispatch(removeFilterTokens({ item }));
    } else {
      dispatch(addFilterTokens({ item }));
    }
  };

  const handleSelectStatuses = (item: string) => {
    if (filter.statuses.includes(item)) {
      dispatch(removeFilterStatuses({ item }));
    } else {
      dispatch(addFilterStatuses({ item }));
    }
  };

  return (
    <Box>
      <BootstrapButton
        aria-describedby={id}
        {...props}
        variant="text"
        size="large"
        startIcon={<FilterListIcon />}
        onClick={handleClick}
      >
        Filters
      </BootstrapButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ cursor: 'pointer' }}
      >
        <Box>
          {dataFilterTokens.map((item, index) => (
            <Box key={index} pt={1} px={2}>
              <Typography fontSize="16px" fontWeight={500} color="primary">
                {item.title}
              </Typography>
              <List>
                {item.data.map((item, index) => (
                  <ListItem key={index} sx={{ padding: '6px' }}>
                    <Box
                      width={120}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      onClick={() => handleSelectTokens(item)}
                    >
                      <Box>
                        <Typography
                          fontSize="12px"
                          sx={{ color: filter.tokens.includes(item) ? 'text.primary' : 'text.secondary' }}
                        >
                          {item}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        {filter.tokens.includes(item) ? <CheckBox sx={{ color: '#0c7ee3' }} fontSize="small" /> : null}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
          {dataFilterStatuses.map((item, index) => (
            <Box key={index} pt={1} px={2}>
              <Typography fontSize="16px" fontWeight={500} color="primary">
                {item.title}
              </Typography>
              <List>
                {item.data.map((item, index) => (
                  <ListItem key={index} sx={{ padding: '6px' }}>
                    <Box
                      width={120}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      onClick={() => handleSelectStatuses(item)}
                    >
                      <Box>
                        <Typography
                          fontSize="12px"
                          sx={{ color: filter.statuses.includes(item) ? 'text.primary' : 'text.secondary' }}
                        >
                          {item}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        {filter.statuses.includes(item) ? (
                          <CheckBox sx={{ color: '#0c7ee3' }} fontSize="small" />
                        ) : null}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      </Popover>
    </Box>
  );
}
