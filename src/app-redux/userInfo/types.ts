export interface UserInfoData {
    token?: string;
    user?: UserProfile;
}

export interface UserProfile {
    name?: string;
    email?: string;
    phone?: string;
    _id?: string;
    avatar?: string;
}

// Action name
export const SET_USER_INFO = '@AUTHENTICATION/SET_USER_INFO';
export const GET_USER_INFO = '@AUTHENTICATION/GET_USER_INFO';
export const LOG_OUT = '@AUTHENTICATION/LOG_OUT';

// Action interface
interface SetUserInfoAction {
    type: typeof SET_USER_INFO;
    data: UserInfoData;
}

interface GetUserInfoAction {
    type: typeof GET_USER_INFO;
}

interface LogOutAction {
    type: typeof LOG_OUT;
}

export type UserInfoTypes = SetUserInfoAction | GetUserInfoAction | LogOutAction;
