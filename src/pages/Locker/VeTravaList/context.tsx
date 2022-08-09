import { createContext, ReactNode, useContext } from 'react';
import { useImmerReducer } from 'use-immer';
import { veTravaListReducer, VeTravaListState, VeTravaReducerAction } from './reducer';

interface VeTravaListData extends VeTravaListState {
  dispatch: React.Dispatch<VeTravaReducerAction>;
}

const initialState: VeTravaListState = {
  merge: {
    selectedItemIds: [],
    max: 2,
  },
  filter: {
    tokens: [],
    statuses: [],
  },
};

interface VeTravaListProps {
  children?: ReactNode;
}

const VeTravaListContext = createContext({} as VeTravaListData);

export function VeTravaListProvider({ children }: VeTravaListProps) {
  const [state, dispatch] = useImmerReducer(veTravaListReducer, initialState);

  return <VeTravaListContext.Provider value={{ ...state, dispatch }}>{children}</VeTravaListContext.Provider>;
}

export const useVeTravaListContext = () => useContext<VeTravaListData>(VeTravaListContext);
