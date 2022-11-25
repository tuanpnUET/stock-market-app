import { LOG_OUT, SET_USER_INFO, UserInfoTypes, UserInfoData, GET_USER_INFO } from './types';

const initialState: UserInfoData = {
    token: undefined,
    user: undefined,
};

const authentication = (state = initialState, action: UserInfoTypes): UserInfoData => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                ...action.data,
            };
        case GET_USER_INFO:
            return {
                ...state,
            };
        case LOG_OUT:
            return {
                token: undefined,
                user: undefined,
            };
        default:
            return state;
    }
};

export default authentication;
