/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useImmer } from 'use-immer';

interface CacheProviderState {
  [key: string]: object | undefined;
}

interface CacheProviderData {
  cache: CacheProviderState;
  push: (_path: _.PropertyPath, _value: any) => void;
  assign: (_pathToObj: _.PropertyPath, ..._source: object[]) => void;
  clear: (_path: _.PropertyPath) => void;
  select: (_path?: _.PropertyPath, _defaultValue?: any) => any;
}

interface CacheProviderProps {
  children?: ReactNode;
}

const CacheContext = createContext({} as CacheProviderData);

export function CacheProvider({ children }: CacheProviderProps) {
  const [cache, setCache] = useImmer<CacheProviderState>({});

  const push = (path: _.PropertyPath, value: any) => {
    setCache((currentCache: CacheProviderState) => {
      _.set(currentCache, path, value);
    });
  };

  const assign = (pathToObj: _.PropertyPath, ...sources: object[]) => {
    setCache((currentCache: CacheProviderState) => {
      _.set(currentCache, pathToObj, _.assignIn(_.get(currentCache, pathToObj, {}), ...sources));
    });
  };

  const clear = (path: _.PropertyPath) => {
    setCache((currentCache: CacheProviderState) => {
      _.unset(currentCache, path);
    });
  };

  const select = (path?: _.PropertyPath, defaultValue?: any): any => {
    if (!path) return cache;
    return _.get(cache, path, defaultValue);
  };

  return <CacheContext.Provider value={{ clear, push, assign, select, cache }}>{children}</CacheContext.Provider>;
}

export const useCacheContext = () => {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error('useCacheContext can only be used within the CacheProvider component');
  return ctx;
};

export const useCacheData = (path?: _.PropertyPath, defaultValue?: any) => {
  const { cache, select } = useCacheContext();
  return useMemo(() => {
    return select(path, defaultValue);
  }, [cache, path]);
};
