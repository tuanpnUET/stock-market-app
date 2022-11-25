import { GET_STOCK_TODAY, SET_STOCK_TODAY } from './types';

const stockToday = (state = [{}], action: any) => {
    switch (action.type) {
        case SET_STOCK_TODAY:
            return action.payload;
        case GET_STOCK_TODAY:
            return state;
        default:
            return state;
    }
};

export default stockToday;
