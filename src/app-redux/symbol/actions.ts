import { ADD_TO_WATCHLIST, GET_ALL_WATCHLIST, REMOVE_FROM_WATCHLIST, SET_WATCHLIST } from './types';

export const addToWatchlist = (payload: any) => {
    return {
        type: ADD_TO_WATCHLIST,
        payload,
    };
};

export const removeFromWatchlist = (payload: any) => {
    return {
        type: REMOVE_FROM_WATCHLIST,
        payload,
    };
};

export const getAllWatchlist = () => {
    return {
        type: GET_ALL_WATCHLIST,
    };
};

export const setWatchlist = (payload: any) => {
    return {
        type: SET_WATCHLIST,
        payload,
    };
};
