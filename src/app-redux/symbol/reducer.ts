import { ADD_TO_WATCHLIST, GET_ALL_WATCHLIST, REMOVE_FROM_WATCHLIST, SET_WATCHLIST } from './types';

const watchList = (state = [{}], action: any) => {
    switch (action.type) {
        case ADD_TO_WATCHLIST:
            return [...state, action.payload];
        case REMOVE_FROM_WATCHLIST:
            return state.filter((obj: any) => obj?.symbol !== action.payload);
        case GET_ALL_WATCHLIST:
            return state;
        case SET_WATCHLIST:
            return action.payload;
        default:
            return state;
    }
};

export default watchList;
