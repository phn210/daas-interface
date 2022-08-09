import axios from 'axios';
import React, { useEffect } from 'react';
// import { BASE18 } from 'src/constants';
// import { Bep20__factory, SwapPair__factory } from 'src/contracts/typechain';
import { BaseContextProps } from 'src/global';
// import { useMulticall } from 'src/hooks/multicall';
// import { useContractGetter, useSwapFactoryContract } from 'src/hooks/useContract';
import useFeedTokenRatio from 'src/hooks/useFeedTokenRatio';
import { BN } from 'src/utils';
import { useAppContext } from '../app-context';
import { useCacheContext, useCacheData } from '../cache-context';

interface TokenPriceContextData {
  prices: {
    [addressOrName: string]: string | number;
  };
}

// interface GetTokenPriceOptions {
//   cache?: boolean;
//   refresh?: boolean;
//   tokenBase?: string;
//   alias?: string;
// }

const TokenPriceContext = React.createContext<TokenPriceContextData>({} as TokenPriceContextData);

export default function TokenPriceProvider({ children }: BaseContextProps) {
  const prices = useCacheData('tokenPrices', {}) as TokenPriceContextData['prices'];
  const { assign } = useCacheContext();
  const { contractAddresses: cAddrs } = useAppContext();
  // const getContract = useContractGetter();
  // const multicall = useMulticall();
  // const swapFactoryContract = useSwapFactoryContract();
  const { getTokenRatio } = useFeedTokenRatio();

  const fetchData = async () => {
    try {
      const [travaPrice, travaBnbRatio] = await Promise.all([
        axios.get('https://scoringapi.trava.finance/supply/app/v0.1/trava-price').then((res) => res.data.price_usd),
        getTokenRatio(cAddrs.TRAVA_BNB_TOKEN_ADDRESS),
      ]);
      const travaBnbPrice = BN(travaPrice).times(travaBnbRatio).toString();
      assign('tokenPrices', {
        [cAddrs.TRAVA_TOKEN_ADDRESS.toLowerCase()]: travaPrice,
        [cAddrs.RTRAVA_TOKEN_ADDRESS.toLowerCase()]: travaPrice,
        [cAddrs.TRAVA_BNB_TOKEN_ADDRESS.toLowerCase()]: travaBnbPrice,
        trava: travaPrice,
        rTrava: travaPrice,
        travaBnb: travaBnbPrice,
      });
    } catch (error) {
      // pass
      console.error(error);
    }
  };

  // const getTokenPrice = async (token: string, options: GetTokenPriceOptions = {}): Promise<number | string> => {
  //   const USD_TOKEN_ADDRESSES = [cAddrs.BUSD_TOKEN_ADDRESS, cAddrs.USDT_TOKEN_ADDRESS];
  //   token = token.toLowerCase();
  //   const { cache = true, refresh = false, tokenBase, alias } = options;

  //   let price = prices[token];
  //   if (!refresh && price) return price;

  //   if (USD_TOKEN_ADDRESSES.includes(token)) return '1';

  //   const BEP20Interface = Bep20__factory.createInterface();

  //   // assuming tokenAddress is a LP address
  //   try {
  //     const pairContract = getContract(token, SwapPair__factory.connect);
  //     if (!pairContract) throw new Error('paircontract is not created');
  //     // this call will raise an error if it is not a LP
  //     const { data } = await multicall.default([
  //       {
  //         interface: pairContract.interface,
  //         calls: [
  //           {
  //             target: pairContract.address,
  //             method: pairContract.interface.getFunction('getReserves'),
  //           },
  //           {
  //             target: pairContract.address,
  //             method: pairContract.interface.getFunction('token0'),
  //           },
  //           {
  //             target: pairContract.address,
  //             method: pairContract.interface.getFunction('token1'),
  //           },
  //           {
  //             target: pairContract.address,
  //             method: pairContract.interface.getFunction('totalSupply'),
  //           },
  //           {
  //             target: pairContract.address,
  //             method: pairContract.interface.getFunction('decimals'),
  //           },
  //         ],
  //       },
  //     ]);
  //     const [reserves, [token0], [token1], [totalSupply], [decimals]] = data[0];
  //     const [
  //       {
  //         data: [[token0Decimals], [token1Decimals]],
  //       },
  //       token0Price,
  //       token1Price,
  //     ] = await Promise.all([
  //       multicall.default([
  //         {
  //           interface: BEP20Interface,
  //           calls: [
  //             {
  //               target: token0,
  //               method: BEP20Interface.getFunction('decimals'),
  //             },
  //             {
  //               target: token1,
  //               method: BEP20Interface.getFunction('decimals'),
  //             },
  //           ],
  //         },
  //       ]),
  //       getTokenPrice(token0),
  //       getTokenPrice(token1),
  //     ]);
  //     reserves[0] = BN(reserves[0]._hex).div(BN(10).pow(token0Decimals._hex)).times(token0Price);
  //     reserves[1] = BN(reserves[1]._hex).div(BN(10).pow(token1Decimals._hex)).times(token1Price);

  //     price = BN(reserves[0])
  //       .plus(reserves[1])
  //       .div(BN(totalSupply).div(BN(10).pow(decimals)))
  //       .toString();

  //     if (cache) {
  //       push(`tokenPrices.${token}`, price);
  //       alias && push(`tokenPrices.${alias}`, price);
  //     }
  //     return price;
  //   } catch (e) {
  //     console.debug(`Token ${token} is not a LP`);
  //   }

  //   // normal token
  //   // calc price of `token` in `_tokenBase`
  //   const _tokenBase = tokenBase ?? USD_TOKEN_ADDRESSES[0];
  //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //   const pairAddress = await swapFactoryContract!.getPair(token, _tokenBase);
  //   const {
  //     data: [[lpToken0Balance], [lpToken1Balance], [token0Decimals], [token1Decimals]],
  //   } = await multicall.default([
  //     {
  //       interface: BEP20Interface,
  //       calls: [
  //         {
  //           target: token,
  //           method: BEP20Interface.getFunction('balanceOf'),
  //           params: [pairAddress],
  //         },
  //         {
  //           target: _tokenBase,
  //           method: BEP20Interface.getFunction('balanceOf'),
  //           params: [pairAddress],
  //         },
  //         {
  //           target: token,
  //           method: BEP20Interface.getFunction('decimals'),
  //         },
  //         {
  //           target: _tokenBase,
  //           method: BEP20Interface.getFunction('decimals'),
  //         },
  //       ],
  //     },
  //   ]);
  //   price = BN(lpToken1Balance._hex)
  //     .div(BN(10).pow(token1Decimals._hex))
  //     .div(BN(lpToken0Balance._hex).div(BN(10).pow(token0Decimals._hex)))
  //     .toString();

  //   if (cache) {
  //     push(`tokenPrices.${token}`, price);
  //     alias && push(`tokenPrices.${alias}`, price);
  //   }
  //   return price;
  // };

  // const getTravaPrice = async () => {
  //   // calc trava price base on Trava/Bnb pair
  //   await Promise.all([
  //     getTokenPrice(cAddrs.TRAVA_TOKEN_ADDRESS, )
  //   ]);
  // };

  useEffect(() => {
    fetchData();
  }, [cAddrs]);

  return (
    <TokenPriceContext.Provider
      value={{
        prices,
      }}
    >
      {children}
    </TokenPriceContext.Provider>
  );
}

export const useTokenPrices = () => React.useContext<TokenPriceContextData>(TokenPriceContext);
