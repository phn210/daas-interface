import { styled } from '@mui/material';
import { NavLink } from 'react-router-dom';

const NavLinkStyled = styled(NavLink)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export { NavLinkStyled as default };
