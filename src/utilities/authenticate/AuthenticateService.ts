import { AxiosRequestConfig } from 'axios';
import { store } from 'app-redux/store';
import { logOutUser, setUserInfo } from 'app-redux/userInfo/actions';
import { logger } from 'utilities/helper';
import { login } from 'api/modules/api-app/authenticate';
import { useState } from 'react';
import AlertMessage from 'components/base/AlertMessage';
import TokenProvider from './TokenProvider';

export interface LoginRequestParams extends AxiosRequestConfig {
    email: string;
    password: string;
}

interface LoginRequest {
    loading: boolean;
    requestLogin: (values: any) => Promise<void>;
}

export const isLogin = () => {
    const { userInfo } = store.getState();
    return !!userInfo?.token;
};

const AuthenticateService = {
    logOut: () => {
        store.dispatch(logOutUser());
    },
    handlerLogin: (user: any) => {
        const saveUserInfo = setUserInfo(user);
        store.dispatch(saveUserInfo);
    },
};

export const useLogin = (): LoginRequest => {
    const [loading, setLoading] = useState(false);
    const requestLogin = async (options: LoginRequestParams) => {
        try {
            setLoading(true);
            const response: any = await login(options);
            const { accessToken } = response;
            // const userResponse = await getProfile(accessToken, response?.user?._id);
            const userResponse = response?.user;
            AuthenticateService.handlerLogin({
                ...response?.user?.token,
                user: userResponse,
            });
            TokenProvider.setNewToken(accessToken);
        } catch (e: any) {
            AlertMessage(e);
            logger(e);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        requestLogin,
    };
};

export default AuthenticateService;
