/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import sizes from 'assets/sizes';
import { Themes } from 'assets/themes';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import useModal from 'components/base/modal/useModal';
import ConfirmModal from 'components/base/modal/ConfirmModal';
import { addToWatchlist, getAllWatchlist, removeFromWatchlist } from 'app-redux/symbol/actions';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { RootState } from 'app-redux/rootReducer';
import Toast from 'react-native-toast-message';
import useLoading from 'components/base/modal/useLoading';
import { addToWatchList, removeFromWatchList } from 'api/modules/api-app/watchlist';

const { width } = Dimensions.get('window');

const StockItem = (props: any) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const modal = useModal();
    const { symbolReducer } = useSelector((state: RootState) => state);
    const [watchList, setWatchList] = useState(symbolReducer?.watchList) as any[];
    const loading = useLoading();

    const checkWatchListHas = (symbol: string) => {
        const newL: any = [];
        watchList.forEach((obj: any) => newL.push(obj?.symbol));
        if (newL.includes(symbol)) {
            return true;
        }
        return false;
    };

    const removeSymbol = async (symbol: any) => {
        try {
            watchList.forEach(async (obj: any) => {
                if (obj?.symbol === symbol) {
                    await removeFromWatchList(obj?._id);
                }
            });
        } catch (err: any) {
            console.log('error', err);
        } finally {
            dispatch(removeFromWatchlist(props?.symbol));
            Toast.show({
                type: 'success',
                text1: t('toastMessage.removeSuccess'),
            });
        }
    };
    const addSymbol = async (symbol: any) => {
        try {
            await addToWatchList({ symbol });
            Toast.show({
                type: 'success',
                text1: t('toastMessage.addSuccess'),
            });
            dispatch(addToWatchlist({ symbol: props?.symbol }));
        } catch (err: any) {
            console.log('error', err);
        }
    };

    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    loading.show();
                    navigation.navigate(TAB_NAVIGATION_ROOT.HOME_ROUTE.DETAIL_STOCK, props?.symbol);
                    setTimeout(() => loading.dismiss(), 3000);
                }}
                onLongPress={() => {
                    // check watchlist to add or remove
                    if (checkWatchListHas(props?.symbol)) {
                        modal.show({
                            children: (
                                <ConfirmModal
                                    text={t('confirmModal.remove')}
                                    confirmText={'common.ok'}
                                    modal={modal}
                                    onConfirm={() => removeSymbol(props?.symbol)}
                                />
                            ),
                            onBackdropPress: () => {
                                modal.dismiss();
                            },
                        });
                    } else {
                        modal.show({
                            children: (
                                <ConfirmModal
                                    text={t('confirmModal.addToWatchlist')}
                                    confirmText={'common.ok'}
                                    modal={modal}
                                    onConfirm={() => addSymbol(props?.symbol)}
                                />
                            ),
                            onBackdropPress: () => {
                                modal.dismiss();
                            },
                        });
                    }
                }}
            >
                <View
                    style={[
                        styles.row,
                        props?.index % 2 === 0 ? { backgroundColor: 'white' } : { backgroundColor: 'gainsboro' },
                    ]}
                >
                    <Text style={[styles.item, { color: Themes.COLORS.strongBlue, fontWeight: 'bold' }]}>
                        {props?.symbol}
                    </Text>
                    <Text style={styles.item} numberOfLines={1} ellipsizeMode="tail">
                        {props?.open}
                    </Text>
                    <Text
                        style={[
                            styles.item,
                            parseInt(props.high, 10) >= parseInt(props.open, 10)
                                ? { color: 'green' }
                                : { color: 'red' },
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {props?.high}
                    </Text>
                    <Text
                        style={[
                            styles.item,
                            parseInt(props.low, 10) >= parseInt(props.open, 10) ? { color: 'green' } : { color: 'red' },
                        ]}
                    >
                        {props.low}
                    </Text>
                    <Text
                        style={[
                            styles.item,
                            parseInt(props.close, 10) >= parseInt(props.open, 10)
                                ? { color: 'green' }
                                : { color: 'red' },
                        ]}
                    >
                        {props.close}
                    </Text>
                    <Text style={[styles.item, { fontWeight: 'bold' }]} numberOfLines={1} ellipsizeMode="tail">
                        {props.volume}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = ScaledSheet.create({
    row: {
        flexDirection: 'row',
        padding: 2,
        width,
        left: 2,
        height: '30@vs',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        width: width / 6.2,
        fontSize: sizes.FONTSIZE.miniLarge,
    },
});

export default StockItem;
