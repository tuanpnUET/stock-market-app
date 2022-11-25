/* eslint-disable no-underscore-dangle */
import React, { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StyledList, StyledText } from 'components/base';
import Images from 'assets/images';
import { ScaledSheet } from 'react-native-size-matters';
import Header from 'components/base/Header';
import { Themes, ThemesDark } from 'assets/themes';
import { getStockToday } from 'api/modules/api-app/general';
import { Searchbar } from 'react-native-paper';
import metrics from 'assets/metrics';
import useLoading from 'components/base/modal/useLoading';
import { setStockTodayStore } from 'app-redux/stockToday/actions';
import TopVolumeItem from './components/TopVolumeItem';
import { ListHeader } from './components/StockList';
import StockItem from './components/StockItem';

// const StockToday = require('assets/data/stock_today.json');

const HomeScreen: FunctionComponent = () => {
    const { t } = useTranslation();
    const [txtSearch, setTxtSearch] = React.useState('');
    const [searchList, setSearchList] = React.useState([]);
    const isFocused = useIsFocused();
    const [topVolume, setTopVolume] = React.useState([]) as any;
    const [initialStock, setInitialStock] = React.useState([]) as any;
    const [stockToday, setStockToday] = useState<any[]>([]) as any;
    const loading = useLoading();
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            loading.show();
            const res = await getStockToday();
            dispatch(setStockTodayStore(res));
            const sortByVolume = (stocks: any) => [...stocks].sort((a: any, b: any) => b?.volume - a?.volume);
            const topVolumeToday = sortByVolume(res);
            setTopVolume(topVolumeToday);
            setStockToday(res);
            setInitialStock(res);
        } catch (err) {
            console.log('err', err);
        } finally {
            loading.dismiss();
        }
    };
    const updateSearch = (search: string) => {
        setTxtSearch(search);
    };
    React.useEffect(() => {
        searchSymbol(txtSearch);
    }, [txtSearch]);

    const searchSymbol = (text: string) => {
        if (text === '') {
            setSearchList([]);
        } else {
            setSearchList(initialStock?.filter((i: any) => i?.symbol?.toLowerCase()?.includes(text?.toLowerCase())));
        }
    };

    useEffect(() => {
        if (isFocused) getData();
    }, []);
    return (
        <>
            {topVolume ? (
                <View style={styles.contScreen}>
                    <Header />
                    <View>
                        <StyledText i18nText={'stock.highestVolume'} customStyle={styles.highestVolume} />
                    </View>
                    <View style={{ paddingTop: 10, height: 80 }}>
                        <TopVolumeItem topVolume={topVolume} />
                    </View>
                    <View style={{ marginBottom: 10 }}>
                        <StyledText i18nText={'stock.stockToday'} customStyle={styles.stockToday} />
                    </View>
                    <View>
                        <View style={{ paddingBottom: 5 }}>
                            <Searchbar
                                icon={Images.icons.search}
                                clearIcon={Images.icons.close}
                                placeholder={t('common.search')}
                                onChangeText={updateSearch}
                                onIconPress={() => updateSearch}
                                value={txtSearch}
                                inputStyle={{
                                    backgroundColor: '#EEEEEE',
                                    marginLeft: 12,
                                    borderRadius: 25,
                                    paddingLeft: 20,
                                }}
                            />
                        </View>
                        <StyledList
                            data={searchList?.length !== 0 ? searchList : stockToday}
                            renderItem={({ item, index }: any) => <StockItem {...item} index={index} />}
                            keyExtractor={(item: any) => `key_${item?._id}`}
                            ListHeaderComponent={ListHeader}
                            stickyHeaderIndices={[0]}
                            noDataText={t('common.noData')}
                        />
                    </View>
                </View>
            ) : (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            )}
        </>
    );
};

const styles = ScaledSheet.create({
    contScreen: {
        flex: 1,
        backgroundColor: ThemesDark.colors.background,
    },
    highestVolume: {
        top: 5,
        fontSize: '20@ms0.3',
        // fontWeight: 'bold',
        color: Themes.COLORS.white,
        left: 10,
    },
    stockToday: {
        fontSize: '20@ms0.3',
        // fontWeight: 'bold',
        color: Themes.COLORS.white,
        left: 10,
    },
    list: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: 'red',
    },
    spinner: {
        height: metrics.screenHeight / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;
