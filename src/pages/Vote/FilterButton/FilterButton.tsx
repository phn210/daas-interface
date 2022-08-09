import * as React from 'react';
import BootstrapButton from '../../../components/primitives/BootstrapButton';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Menu, MenuItem, Typography } from '@mui/material';
import { CheckBox } from '@mui/icons-material';
import { EnumStatus } from '../EnumStatus';

type FilterBtnProps = {
  filterState: number[];
  setFilterState: (list: number[]) => void;
};

export default function FilterButton(props: FilterBtnProps) {
  const [anchorEl, setAnchorEl] = React.useState<(EventTarget & HTMLButtonElement) | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleFilterOption = (value: number) => {
    if (!props.filterState) props.setFilterState([value]);
    else {
      const index = props.filterState.indexOf(value);
      if (index > -1) {
        const newFilter = props.filterState.filter((val) => val != value);
        props.setFilterState(newFilter);
      } else {
        props.setFilterState([...props.filterState, value]);
      }
    }
  };

  return (
    <div>
      <BootstrapButton
        variant="text"
        size="large"
        startIcon={<FilterListIcon />}
        sx={{ ml: 1 }}
        id="btn-filter-status"
        aria-controls={open ? 'filter-status-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Filters
      </BootstrapButton>
      <Menu
        id="filter-status-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'btn-filter-status',
        }}
        elevation={1}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{ '& .MuiPaper-root': { boxShadow: '0px 1px 10px -3px' } }}
      >
        <Typography sx={{ minWidth: '200px', p: 1, fontWeight: 'bold' }} color="primary">
          Status
        </Typography>
        {EnumStatus.map((status, index) => {
          return (
            <MenuItem
              onClick={() => toggleFilterOption(index)}
              sx={{ textTransform: 'capitalize' }}
              key={'statusfilter' + status}
            >
              {status}
              <CheckBox
                color="primary"
                sx={{ ml: 'auto', display: props.filterState.includes(index) ? 'block' : 'none' }}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
