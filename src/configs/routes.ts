import React from 'react';
import { LayoutType, LayoutOptions } from '../layouts';
import { LocationDescriptor } from 'history';

export interface RouteConfig {
  path: string;
  exact: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.LazyExoticComponent<(_props: any) => JSX.Element> | ((_props: any) => JSX.Element);
  redirect?: boolean;
  to?: LocationDescriptor;
  animation?: string;
  layout?: LayoutType;
  disableInProduction?: boolean;
}

export default [
  {
    path: '/styles',
    exact: true,
    component: React.lazy(() => import('../pages/Document')),
    layout: LayoutOptions.BLANK,
    disableInProduction: true,
  },
  {
    path: '/',
    exact: true,
    redirect: true,
    to: '/daos',
  },
  {
    path: '/daos',
    exact: true,
    component: React.lazy(() => import('../pages/Main')),
    layout: LayoutOptions.FIRST,
  },
  {
    path: '/daos/create',
    exact: true,
    component: React.lazy(() => import('../pages/Main/DAOCreation')),
    layout: LayoutOptions.FIRST,
  },
  {
    path: '/daos/:daoId',
    exact: true,
    redirect: true,
    to: '/:daoId/overview'
  },
  {
    path: '/:daoId',
    exact: true,
    redirect: true,
    to: '/:daoId/overview'
  },
  {
    path: '/:daoId/overview',
    exact: true,
    component: React.lazy(() => import('../pages/DAO/Overview')),
    layout: LayoutOptions.MAIN,
  },
  {
    path: '/:daoId/proposals',
    exact: true,
    component: React.lazy(() => import('../pages/DAO/Proposals')),
    layout: LayoutOptions.MAIN,
  },
  {
    path: '/:daoId/proposals/create',
    exact: true,
    component: React.lazy(() => import('../pages/DAO/Proposals/ProposalCreation')),
    layout: LayoutOptions.MAIN,
  },
  {
    path: '/:daoId/proposals/:proposalId',
    exact: true,
    component: React.lazy(() => import('../pages/DAO/Proposals/ProposalDetails')),
    layout: LayoutOptions.MAIN,
  },
  {
    path: '/:daoId/admin',
    exact: true,
    component: React.lazy(() => import('../pages/DAO/Contracts')),
    layout: LayoutOptions.MAIN,
  },


] as RouteConfig[];
