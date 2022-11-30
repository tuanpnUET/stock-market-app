/* eslint-disable no-unused-expressions */
/* eslint-disable no-sequences */
import axios from 'axios';
import TokenProvider from 'utilities/authenticate/TokenProvider';
import { apiLogger } from 'utilities/logger';

const request = axios.create({
    baseURL: 'https://stock-market-vn.herokuapp.com',
    timeout: 60000,
    headers: { Accept: '*/*' },
});
request.interceptors.request.use(
    async (config: any) => {
        const token = TokenProvider.getToken();
        if (token) {
            config.headers.token = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        // Do something with api error
        apiLogger('api error', 'background: red; color: #fff', error.response);
        return Promise.reject(error);
    },
);

request.interceptors.response.use((response: any) => {
    return response?.data || 'Something went wrong!';
});

export default request;
