import BlankLayout from './BlankLayout';
import MainLayout from './MainLayout';
import FirstLayout from './FirstLayout';

export type LayoutType = 'BlankLayout' | 'MainLayout';

export const LayoutOptions = {
  BLANK: 'BlankLayout',
  MAIN: 'MainLayout',
  FIRST: 'FirstLayout'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Layouts: { [key: string]: (_props: any) => JSX.Element } = {
  BlankLayout,
  MainLayout,
  FirstLayout
};
