/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Metrics from 'assets/metrics';
import { StyledIcon, StyledText, StyledTouchable } from 'components/base';
import React, { Fragment, FunctionComponent, useState } from 'react';
import { View } from 'react-native';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import Size from 'assets/sizes';
import { Themes, ThemesDark } from 'assets/themes';
import { useNavigation } from '@react-navigation/native';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import useModal from 'components/base/modal/useModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app-redux/rootReducer';
import ConfirmModal from 'components/base/modal/ConfirmModal';
import { addToWatchlist, removeFromWatchlist } from 'app-redux/symbol/actions';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import Images from 'assets/images';
import useLoading from 'components/base/modal/useLoading';
import { isIos } from 'utilities/helper';
import { addToWatchList, removeFromWatchList } from 'api/modules/api-app/watchlist';

// const topVolumeData = require('assets/data/top_volume.json');

const horizontalMargin = 15;
const sliderWidth = Metrics.screenWidth;

const slideWidth = Metrics.screenWidth / 2;
const itemWidth = 200;
const scaleItemWidth = !isIos ? Math.round(moderateScale(itemWidth)) - 15 : Math.round(moderateScale(itemWidth)) - 40;

const TopVolumeItem = (props: any) => {
    const { topVolume } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const modal = useModal();
    const { symbolReducer } = useSelector((state: RootState) => state);
    const [watchList, setWatchList] = useState(symbolReducer?.watchList) as any[];
    const [carousel, setCarousel] = useState<any>();
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
            await addToWatchList(symbol);
            Toast.show({
                type: 'success',
                text1: t('toastMessage.addSuccess'),
            });
            dispatch(addToWatchlist({ symbol: props?.symbol }));
        } catch (err: any) {
            console.log('error', err);
        }
    };

    const renderItem = ({ item, index }: any) => (
        <StyledTouchable
            onPress={() => {
                // go to detail
                loading.show();
                navigation.navigate(TAB_NAVIGATION_ROOT.HOME_ROUTE.DETAIL_STOCK, item?.symbol);
                setTimeout(() => loading.dismiss(), 3000);
            }}
            onLongPress={() => {
                // check watchlist to add or remove
                if (checkWatchListHas(item?.symbol)) {
                    modal.show({
                        children: (
                            <ConfirmModal
                                text={t('confirmModal.remove')}
                                confirmText={'common.ok'}
                                modal={modal}
                                onConfirm={() => removeSymbol(item?.symbol)}
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
            customStyle={styles.slide}
        >
            <View style={{ paddingLeft: 5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <StyledText
                        customStyle={[styles.symbol, { color: Themes.COLORS.white }]}
                        i18nText={'common.symbol1'}
                    />
                    <StyledText customStyle={styles.symbol} originValue={` ${item?.symbol}`} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <StyledText customStyle={styles.volume} i18nText={'common.volume1'} />
                    <StyledText customStyle={styles.volume} originValue={`${item?.volume}`} />
                </View>
            </View>
        </StyledTouchable>
    );
    return (
        <>
            <StyledTouchable
                onPress={() => carousel?.snapToItem(0, true, true)}
                customStyle={{ position: 'absolute', right: 10, top: -25 }}
            >
                <StyledIcon size={40} source={Images.icons.back} customStyle={{ tintColor: Themes.COLORS.white }} />
            </StyledTouchable>
            <Carousel
                ref={(c: any) => {
                    setCarousel(c);
                }}
                autoplay={true}
                sliderHeight={60}
                itemHeight={60}
                enableMomentum={false}
                lockScrollWhileSnapping={true}
                loop={true}
                data={topVolume}
                renderItem={renderItem}
                sliderWidth={sliderWidth}
                itemWidth={slideWidth}
                containerCustomStyle={styles.containerCustomStyle}
                inactiveSlideOpacity={1}
                inactiveSlideScale={1}
                horizontal
                // useNativeDriver
                autoplayDelay={5000}
                autoplayInterval={5000}
                // {...carouselProps}
            />
        </>
    );
};

const styles = ScaledSheet.create({
    slide: {
        flexDirection: 'row',
        width: `${scaleItemWidth}@s`,
        height: '60@vs',
        margin: 5,
        left: -90,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: Themes.COLORS.dark,
    },
    containerCustomStyle: {
        position: 'relative',
        // backgroundColor: 'red',
    },
    symbol: {
        fontSize: Size.FONTSIZE.large,
        fontWeight: 'bold',
        color: Themes.COLORS.blue,
    },
    prize: {
        fontSize: Size.FONTSIZE.normal,
        color: Themes.COLORS.white,
    },
    volume: {
        fontSize: Size.FONTSIZE.normal,
        color: Themes.COLORS.white,
    },
});

export default TopVolumeItem;
