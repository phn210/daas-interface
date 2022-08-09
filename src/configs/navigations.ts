import MuiSvgIcon from '@mui/material/SvgIcon';
import { ChatIcon, CheckCircleIcon, DashboardIcon, DocumentIcon, LockIcon, SvgComponent } from 'src/icons';

export interface AppNavProps {
  id: string;
  title: string;
  url: string;
  isExternalLink: boolean;
  collapsible?: boolean; // if true, nav will be hidden in small screen
  isActive?: boolean;
}

export interface InternalNavProps {
  id: string;
  title: string;
  navLink: string;
  activePattern?: string;
  isExternalLink: boolean;
  exact?: boolean;
  Icon: typeof MuiSvgIcon | SvgComponent;
}

export const appNavs: AppNavProps[] = [];

export const internalNavs: InternalNavProps[] = [
  {
    id: 'overview',
    title: 'Overview',
    navLink: '/overview',
    isExternalLink: false,
    exact: true,
    Icon: DashboardIcon,
  },
  {
    id: 'proposals',
    title: 'Proposals',
    navLink: '/proposals',
    activePattern: '^/proposals(/.*)?',
    isExternalLink: false,
    exact: true,
    Icon: CheckCircleIcon,
  },
  {
    id: 'admin',
    title: 'Admin',
    navLink: '/admin',
    isExternalLink: false,
    exact: true,
    Icon: LockIcon,
  }
];
