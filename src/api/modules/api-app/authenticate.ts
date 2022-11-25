import request from 'api/request';

export const getProfile = (token?: string, id?: string) =>
    request.get(`/users/${id}`, { headers: { token: `Bearer ${token}` } });
export const login = (params: any) => request.post(`/users/login`, params);
export const register = (params: any) => request.post(`/users/register`, params);
export const deleteAccount = (id?: string) => request.delete(`/users/${id}`);
export const updateProfile = (token?: string, params?: any) =>
    request.put(`/users/updateProfile`, params, { headers: { token: `Bearer ${token}` } });
export const updatePassword = (token?: string, params?: any) =>
    request.put(`/users/updatePassword`, params, { headers: { token: `Bearer ${token}` } });

export const getVerifyCode = (params: any) => request.post(`/users/email`, params);
export const checkIsExistEmail = (email: string) => request.post(`/auth/check-account-existed`, { email });
export const checkVerifyCode = (params: any) => request.post(`/users/email/verify`, params);
export const updatePasswordWhenForgot = (params?: any) => request.put(`/users/updatePasswordWhenForgot`, params);
