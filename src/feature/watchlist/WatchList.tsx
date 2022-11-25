/* eslint-disable @typescript-eslint/no-unused-vars */
import StockList from 'feature/home/components/StockList';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { addToWatchlist, getAllWatchlist, setWatchlist } from 'app-redux/symbol/actions';
import { StyledIcon, StyledText, StyledTouchable } from 'components/base';
import { SafeAreaView } from 'react-native-safe-area-context';
import sizes from 'assets/sizes';
import { Themes, ThemesDark } from 'assets/themes';
import Images from 'assets/images';
import { ScaledSheet } from 'react-native-size-matters';
import { navigate } from 'navigation/NavigationService';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app-redux/rootReducer';
import { useIsFocused } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Header from 'components/base/Header';
import { getStockToday } from 'api/modules/api-app/general';
import useLoading from 'components/base/modal/useLoading';
import { getWatchList } from 'api/modules/api-app/watchlist';

const StockToday = require('assets/data/stock_today.json');

const WatchList = (props: any) => {
    const isFocused = useIsFocused();
    const { stockTodayReducer, symbolReducer } = useSelector((state: RootState) => state);
    const [watchList, setWatchList] = useState(symbolReducer?.watchList) as any[];
    const [stockWatchList, setStockWatchList] = React.useState([]) as any[];
    const [stockToday, setStockToday] = useState<any[]>([]) as any[];
    const loading = useLoading();
    const { userInfo } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const resWatchList: any = await getWatchList(userInfo?.token);
            dispatch(setWatchlist(resWatchList));
            const res = await getStockToday();
            setStockToday(res);
        } catch (error) {
            console.log('error', error);
        }
    };
    useEffect(() => {
        if (isFocused) fetchData();
    }, [isFocused]);

    function getData() {
        const symbolList: Array<any> = [];
        stockToday.forEach((stock: any) => symbolList.push(stock.symbol));
        const watchListFormat: Array<any> = [];
        watchList.forEach((obj: any) => watchListFormat.push(obj?.symbol));
        const newR: any = [];
        stockToday.forEach((stock: any) => {
            if (watchListFormat.includes(stock?.symbol)) newR.push(stock);
        });
        setStockWatchList(newR);
    }

    useEffect(() => {
        if (symbolReducer?.watchList) setWatchList(symbolReducer?.watchList);
    }, [symbolReducer?.watchList]);

    useEffect(() => {
        if (isFocused) getData();
    }, [stockToday, watchList]);
    return (
        <View style={styles.watchList}>
            <Header />
            {stockWatchList.length === 0 && <StyledText i18nText={'watchlist.noData'} customStyle={styles.noData} />}
            {stockWatchList && <StockList data={stockWatchList} />}
        </View>
    );
};

export default WatchList;

const styles = ScaledSheet.create({
    watchList: {
        flex: 1,
        backgroundColor: '#F0F0F0',
    },
    noData: {
        fontSize: sizes.FONTSIZE.normal,
        color: Themes.COLORS.red,
        margin: 5,
    },
});
