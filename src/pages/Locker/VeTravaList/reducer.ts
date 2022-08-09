/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
import { ReducerAction } from 'src/global';

export interface VeTravaListState {
  merge: {
    selectedItemIds: (number | string)[];
    max: number;
  };
  filter: {
    tokens: string[];
    statuses: string[];
  };
}

export type VeTravaReducerAction = ReducerAction<VeTravaActionType, object | undefined>;

export enum VeTravaActionType {
  ADD_SELECTED_ITEM = 'ADD_SELECTED_ITEM',
  REMOVE_SELECTED_ITEM = 'REMOVE_SELECTED_ITEM',
  REMOVE_ALL_SELECTED_ITEMS = 'REMOVE_ALL_SELECTED_ITEMS',

  ADD_FILTER_TOKEN = 'ADD_FILTER_TOKEN',
  REMOVE_FILTER_TOKEN = 'REMOVE_FILTER_TOKEN',
  REMOVE_ALL_FILTER_TOKEN = 'REMOVE_ALL_FILTER_TOKEN',

  ADD_FILTER_STATUS = 'ADD_FILTER_STATUS',
  REMOVE_FILTER_STATUS = 'REMOVE_FILTER_STATUS',
  REMOVE_ALL_FILTER_STATUS = 'REMOVE_ALL_FILTER_STATUS',
}

export function veTravaListReducer(state: VeTravaListState, action: ReducerAction<VeTravaActionType, any>) {
  switch (action.type) {
    case VeTravaActionType.ADD_SELECTED_ITEM:
      state.merge.selectedItemIds.push(action.payload.id);
      break;
    case VeTravaActionType.REMOVE_SELECTED_ITEM:
      state.merge.selectedItemIds = state.merge.selectedItemIds.filter((id) => id !== action.payload.id);
      break;
    case VeTravaActionType.REMOVE_ALL_SELECTED_ITEMS:
      state.merge.selectedItemIds = [];
      break;

    case VeTravaActionType.ADD_FILTER_TOKEN:
      state.filter.tokens.push(action.payload.item);
      break;
    case VeTravaActionType.REMOVE_FILTER_TOKEN:
      state.filter.tokens = state.filter.tokens.filter((item) => item !== action.payload.item);
      break;
    case VeTravaActionType.REMOVE_ALL_FILTER_TOKEN:
      state.filter.tokens = [];
      break;

    case VeTravaActionType.ADD_FILTER_STATUS:
      state.filter.statuses.push(action.payload.item);
      break;
    case VeTravaActionType.REMOVE_FILTER_STATUS:
      state.filter.statuses = state.filter.statuses.filter((item) => item !== action.payload.item);
      break;
    case VeTravaActionType.REMOVE_ALL_FILTER_STATUS:
      state.filter.statuses = [];
      break;

    default:
      return state;
  }
}

export const addSelectedItem = (payload: any) => ({ type: VeTravaActionType.ADD_SELECTED_ITEM, payload });
export const removeSelectedItem = (payload: any) => ({ type: VeTravaActionType.REMOVE_SELECTED_ITEM, payload });
export const removeAllSelectedItems = () => ({ type: VeTravaActionType.REMOVE_ALL_SELECTED_ITEMS, payload: {} });

export const addFilterStatuses = (payload: any) => ({ type: VeTravaActionType.ADD_FILTER_STATUS, payload });
export const removeFilterStatuses = (payload: any) => ({ type: VeTravaActionType.REMOVE_FILTER_STATUS, payload });
export const removeAllFilterStatuses = () => ({ type: VeTravaActionType.REMOVE_ALL_FILTER_STATUS });

export const addFilterTokens = (payload: any) => ({ type: VeTravaActionType.ADD_FILTER_TOKEN, payload });
export const removeFilterTokens = (payload: any) => ({ type: VeTravaActionType.REMOVE_FILTER_TOKEN, payload });
export const removeAllFilterTokens = () => ({ type: VeTravaActionType.REMOVE_ALL_FILTER_TOKEN });
