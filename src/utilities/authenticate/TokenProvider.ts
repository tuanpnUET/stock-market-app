import { store } from 'app-redux/store';
import { setUserInfo } from 'app-redux/userInfo/actions';

const TokenProvider = {
    setNewToken: (accessToken: string) => {
        const { userInfo } = store.getState();
        store.dispatch(setUserInfo({ token: accessToken, user: userInfo?.user || undefined }));
    },
    getToken: () => {
        const { userInfo } = store.getState();
        return userInfo.token || '';
    },
    clearToken: () => {
        store.dispatch(setUserInfo({}));
    },
};

export default TokenProvider;
