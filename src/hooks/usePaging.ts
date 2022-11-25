import { AxiosRequestConfig } from 'axios';
import { useEffect, useState } from 'react';

const usePaging = (requestPaging: (config: AxiosRequestConfig) => Promise<any>, initialParams?: any) => {
    const [pagingData, _setPagingData] = useState({
        refreshing: false,
        loadingMore: false,
        pageIndex: 1,
        list: [],
        noMore: false,
    });
    const setPagingData = (data: any) => {
        _setPagingData(data);
    };
    const [params, setParams] = useState<any>(initialParams);
    useEffect(() => {
        runRequest(pagingData.pageIndex, params);
    }, [pagingData.pageIndex]);

    useEffect(() => {
        onRefresh();
    }, [params]);
    const handleOnSuccess = (data: any) => {
        const responseData = data || {};
        const newList: [] = responseData || [];

        if (pagingData.pageIndex === 1) {
            setPagingData({
                ...pagingData,
                list: newList,
                noMore: pagingData.pageIndex >= responseData?.totalPages,
                refreshing: false,
                loadingMore: false,
            });
        } else if (newList.length > 0) {
            setPagingData({
                ...pagingData,
                list: [...pagingData.list, ...newList],
                noMore: pagingData.pageIndex >= responseData?.totalPages,
                refreshing: false,
                loadingMore: false,
            });
        }
    };
    // config request paging
    const runRequest = async (requestPageIndex: number, otherParams?: any) => {
        const res = await requestPaging({
            params: {
                pageIndex: requestPageIndex,
                ...otherParams,
            },
        });
        handleOnSuccess(res);
    };
    const onRefresh = () => {
        if (pagingData.pageIndex > 1) {
            setPagingData({
                ...pagingData,
                refreshing: true,
                pageIndex: 1,
            });
        } else {
            runRequest(1, params);
        }
    };

    const onLoadMore = () => {
        // const { list, ...data } = pagingData;
        // alert(JSON.stringify(data));
        if (!pagingData.noMore) {
            setPagingData({
                ...pagingData,
                loadingMore: true,
                pageIndex: pagingData.pageIndex + 1,
            });
        }
    };
    return {
        pagingData,
        onRefresh,
        onLoadMore,
        params,
        setParams,
        _setPagingData,
    };
};

export default usePaging;
