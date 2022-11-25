import { SET_USER_INFO, UserInfoTypes, LOG_OUT, GET_USER_INFO, UserInfoData } from './types';

export const setUserInfo = (data: UserInfoData): UserInfoTypes => ({
    type: SET_USER_INFO,
    data,
});

export const getUserInfo = (): UserInfoTypes => ({
    type: GET_USER_INFO,
});

export const logOutUser = (): UserInfoTypes => ({
    type: LOG_OUT,
});
