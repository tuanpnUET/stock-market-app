import request from 'api/request';

export const getWatchList = (token: any) => request.get(`/watch-list/me`, { headers: { token: `Bearer ${token}` } });
export const addToWatchList = (param: any) => request.post(`/watch-list`, param);
export const removeFromWatchList = (id: any) => request.delete(`/watch-list/${id}`);
