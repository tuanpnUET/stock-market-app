import request from 'api/request';

export const uploadImage = (formData: any): Promise<any> => request.post(`/uploadImg`, formData);
export const getAllCourse = (): Promise<any> => request.get(`/courses`);
export const getAllCategory = (): Promise<any> => request.get(`/categories`);

export const getStock = (): Promise<any> => request.get(`/stocks`);
export const getStockToday = (): Promise<any> => request.get(`/stocks-today`);
export const getAllDetailStock = (): Promise<any> => request.get(`/detail-stocks`);

export const getStockBySymbol = (symbol: string) => request.get(`/stocks/one-year?symbol=${symbol}`);
export const getDetailStockBySymbol = (symbol: string) => request.get(`/detail-stocks?symbol=${symbol}`);
export const getPredictStockBySymbol = (symbol: string) => request.get(`/predict-stocks?symbol=${symbol}`);
