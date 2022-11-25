/* eslint-disable import/prefer-default-export */
import request from 'api/request';

export const getAllPost = (params: any) => request.get(`/posts`, params);
export const createPost = (params?: any) => request.post(`/posts`, params);
export const updatePost = (id: string, params: any) => request.put(`/posts/${id}`, params);
export const deletePost = (id: string) => request.delete(`/posts/${id}`);
