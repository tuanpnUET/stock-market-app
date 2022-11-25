import { GET_STOCK_TODAY, SET_STOCK_TODAY } from './types';

export const setStockTodayStore = (payload: any) => ({
    type: SET_STOCK_TODAY,
    payload,
});

export const getStockTodayStore = () => ({
    type: GET_STOCK_TODAY,
});
