import { useNavigation } from '@react-navigation/native';
import Images from 'assets/images';
import Metrics from 'assets/metrics';
import Size from 'assets/sizes';
import { Themes, ThemesDark } from 'assets/themes';
import { StyledIcon, StyledText, StyledTouchable } from 'components/base';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, ScrollView, Text } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import Carousel from 'react-native-snap-carousel';
import { Calendar } from 'react-native-calendars';
import AlertMessage from 'components/base/AlertMessage';
import { LineChart } from 'react-native-gifted-charts';
import useLoading from 'components/base/modal/useLoading';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'react-native-paper';
import { getDetailStockBySymbol, getStockBySymbol } from 'api/modules/api-app/general';
import testIDs from './testIDs';

const sliderWidth = Metrics.screenWidth;

const slideWidth = Metrics.screenWidth;
const itemWidth = Metrics.screenWidth;
const HEIGHT_GRAPH = 400;
const STEP = 50;
const SECTIONS = 8;

const DetailStock = ({ route }: any) => {
    const [stockData, setStockData] = useState<any[]>([]);
    const [detailStock, setDetailStock] = useState() as any;
    const navigation = useNavigation();
    const [selected, setSelected] = useState() as any;
    const [initialCloseList, setInitialCloseList] = useState<any[]>([]);
    const [showCalendar, setShowCalendar] = useState<boolean>(false);
    const [carousel, setCarousel] = useState<any>();
    const [closeList, setCloseList] = useState<any[]>([]);
    const [maxClose, setMaxClose] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [monthActive, setMonthActive] = useState<boolean>(false);
    const [yearActive, setYearActive] = useState<boolean>(true);
    const loading = useLoading();
    const { t } = useTranslation();

    const onDayPress = useCallback(
        (day: any) => {
            const index = checkIndexItem(day.dateString);
            setSelected(day.dateString);
            if (index >= 0) {
                carousel?.snapToItem(index, true, true);
                // setShowCalendar(false);
            } else {
                AlertMessage(t('common.noData'));
            }
        },
        [selected],
    );
    const marked = useMemo(() => {
        return {
            [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'orange',
                selectedTextColor: 'red',
            },
        };
    }, [selected]);
    const loadData = async () => {
        try {
            loading.show();
            let result: any = null;
            await getStockBySymbol(route?.params).then((response) => {
                result = response;
            });
            const detail: any = await getDetailStockBySymbol(route?.params);
            setDetailStock(detail);
            const closeDat = closeListFunc(result);
            setCloseList(closeDat);
            setInitialCloseList(closeDat);
            setMaxClose(findMax(closeDat));
            setSelected(stockData[0]?.date?.substring(0, 10));
            setStockData(result?.reverse());
        } catch (err) {
            console.log('err', err);
        } finally {
            loading.dismiss();
        }
    };
    useEffect(() => {
        loadData();

        return () => {
            setMonthActive(false);
            setYearActive(true);
        };
    }, []);

    useEffect(() => {
        if (closeList) {
            setMaxClose(findMax(closeList));
        }
    }, [closeList]);

    function checkIndexItem(date: string) {
        return stockData.findIndex((stock: any) => stock?.date?.substring(0, 10).includes(date));
    }
    function checkDate(index: number) {
        return stockData[index].date?.substring(0, 10);
    }

    function findMax(obj: any[]) {
        let max = parseInt(obj[0]?.value, 10);
        obj.forEach((stock: any) => {
            if (parseInt(stock?.value, 10) > max) max = parseInt(stock?.value, 10);
        });
        return max;
    }

    useEffect(() => {
        if (maxClose) {
            const test = parseInt((maxClose / 10000).toFixed(), 10) + 0.5;
            setHeight(test * 10000);
        }
    }, [maxClose]);

    function closeListFunc(obj: any) {
        const result = [] as any[];
        obj.forEach((stock: any) => {
            const value = {
                value: stock?.close,
                date: stock?.date?.substring(0, 10),
            };
            result.push(value);
        });
        return result;
    }
    const filterData = (filter: string) => {
        if (filter === 'month') {
            loading.show();
            setMonthActive(true);
            setYearActive(false);
            setCloseList(
                closeList.filter(
                    (item: any) =>
                        (new Date(`${closeList[closeList.length - 1].date}`).valueOf() -
                            new Date(`${item.date}`).valueOf()) /
                            86400000 <=
                        30,
                ),
            );
        }
        if (filter === 'year') {
            loading.show();
            setMonthActive(false);
            setYearActive(true);
            setCloseList(initialCloseList);
        }
        setTimeout(() => {
            loading.dismiss();
        }, 500);
    };
    const renderItem = ({ item, index }: any) => {
        const beforeDate = stockData[index === 0 ? index : index - 1];
        const change = (
            ((parseFloat(item?.close) - parseFloat(beforeDate?.close)) / parseFloat(beforeDate?.close)) *
            100
        ).toFixed(2);
        return (
            <StyledTouchable
                onPress={() => {
                    //
                }}
                customStyle={styles.slide}
            >
                <View style={{ alignSelf: 'center', margin: 10, width: itemWidth - 20 }}>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <StyledText
                            customStyle={[styles.symbol, { color: Themes.COLORS.black }]}
                            i18nText={'common.symbol1'}
                        />
                        <StyledText
                            customStyle={[styles.symbol, { fontWeight: 'bold' }]}
                            originValue={`${item?.symbol}`}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <StyledText customStyle={styles.prize} i18nText={'common.open1'} />
                            <StyledText customStyle={styles.prize} originValue={`${item?.open}`} />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <StyledText customStyle={styles.prize} i18nText={'common.closeStock1'} />
                            <StyledText
                                customStyle={
                                    (styles.prize,
                                    parseInt(item.close, 10) >= parseInt(item.open, 10)
                                        ? { color: 'green', fontSize: Size.FONTSIZE.large }
                                        : { color: 'red', fontSize: Size.FONTSIZE.large })
                                }
                                originValue={`${item?.close}`}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <StyledText customStyle={styles.prize} i18nText={'common.high1'} />
                            <StyledText
                                customStyle={
                                    (styles.prize,
                                    parseInt(item.high, 10) >= parseInt(item.open, 10)
                                        ? { color: 'green', fontSize: Size.FONTSIZE.large }
                                        : { color: 'red', fontSize: Size.FONTSIZE.large })
                                }
                                originValue={`${item?.high}`}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <StyledText customStyle={styles.prize} i18nText={'common.low1'} />
                            <StyledText
                                customStyle={
                                    (styles.prize,
                                    parseInt(item.low, 10) >= parseInt(item.open, 10)
                                        ? { color: 'green', fontSize: Size.FONTSIZE.large }
                                        : { color: 'red', fontSize: Size.FONTSIZE.large })
                                }
                                originValue={`${item?.low}`}
                            />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <StyledText customStyle={styles.volume} i18nText={'common.volume1'} />
                            <StyledText
                                customStyle={[styles.volume, { fontWeight: 'bold' }]}
                                originValue={`${item?.volume}`}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <StyledText customStyle={styles.prize} i18nText={'common.change1'} />
                            <StyledText
                                customStyle={
                                    (styles.prize,
                                    parseFloat(change) >= 0
                                        ? { color: 'green', fontSize: Size.FONTSIZE.large }
                                        : { color: 'red', fontSize: Size.FONTSIZE.large })
                                }
                                originValue={`${change}%`}
                            />
                        </View>
                    </View>
                </View>
            </StyledTouchable>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <StyledTouchable onPress={() => navigation.goBack()}>
                    <StyledIcon
                        size={50}
                        source={Images.icons.close}
                        customStyle={{ tintColor: Themes.COLORS.white }}
                    />
                </StyledTouchable>
                <StyledText i18nText={'detailStock.title'} customStyle={styles.title} />
                <View style={styles.right} />
            </View>
            <ScrollView>
                <View style={styles.companyContainer}>
                    <StyledText originValue={detailStock?.organName} customStyle={styles.companyName} />
                    <View style={{ flexDirection: 'row' }}>
                        <StyledText originValue={t('common.symbol1')} customStyle={styles.sb} />
                        <StyledText originValue={detailStock?.ticker} customStyle={styles.sb} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <StyledText originValue={t('common.stock1')} customStyle={styles.sb} />
                        <StyledText originValue={detailStock?.comGroupCode} customStyle={styles.sb} />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <StyledText
                        originValue={t('common.update', { value: selected })}
                        customStyle={{ fontSize: 16, color: 'white', margin: 5 }}
                    />
                    <StyledTouchable
                        onPress={() => carousel?.snapToItem(0, true, true)}
                        customStyle={{ position: 'absolute', right: 50 }}
                    >
                        <StyledIcon
                            size={40}
                            source={Images.icons.back}
                            customStyle={{ tintColor: Themes.COLORS.yellow }}
                        />
                    </StyledTouchable>
                    <StyledTouchable
                        onPress={() => setShowCalendar(!showCalendar)}
                        customStyle={{ marginRight: 15, margin: 5 }}
                    >
                        <StyledIcon
                            size={25}
                            source={Images.icons.calender}
                            customStyle={{ tintColor: Themes.COLORS.yellow }}
                        />
                    </StyledTouchable>
                </View>

                {showCalendar && (
                    <Calendar
                        testID={testIDs.calendars.FIRST}
                        enableSwipeMonths
                        current={selected}
                        style={styles.calendar}
                        onDayPress={onDayPress}
                        markedDates={marked}
                    />
                )}

                <Carousel
                    ref={(c: any) => {
                        setCarousel(c);
                    }}
                    data={stockData}
                    renderItem={renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={slideWidth}
                    containerCustomStyle={styles.containerCustomStyle}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}
                    onSnapToItem={(index) => setSelected(checkDate(index))}
                />
                <StyledText
                    customStyle={[
                        styles.symbol,
                        { color: Themes.COLORS.white, margin: 5, bottom: -10, paddingBottom: 10 },
                    ]}
                    i18nText={t('common.graph')}
                />
                <View style={styles.footer}>
                    <IconButton
                        icon={Images.icons.month}
                        color={monthActive ? Themes.COLORS.yellow : Themes.COLORS.white}
                        size={30}
                        onPress={() => {
                            if (!monthActive) filterData('month');
                        }}
                    />
                    <IconButton
                        icon={Images.icons.year}
                        color={yearActive ? Themes.COLORS.yellow : Themes.COLORS.white}
                        size={30}
                        onPress={() => {
                            if (!yearActive) filterData('year');
                        }}
                    />
                </View>
                <View
                    style={{
                        paddingVertical: 0,
                        margin: 5,
                        marginRight: 5,
                        paddingBottom: 5,
                    }}
                >
                    <LineChart
                        areaChart
                        curved={true}
                        data={closeList}
                        hideDataPoints={false}
                        width={Metrics.screenWidth - 60}
                        rulesLength={Metrics.screenWidth - 50}
                        spacing={monthActive ? 16 : 6}
                        adjustToWidth={!!monthActive}
                        thickness={1}
                        dataPointsColor={Themes.COLORS.white}
                        startFillColor={Themes.COLORS.white}
                        color={Themes.COLORS.black}
                        color2={'blue'}
                        endFillColor={Themes.COLORS.blue}
                        // startOpacity={0.9}
                        roundToDigits={1}
                        endOpacity={0.2}
                        initialSpacing={0}
                        noOfSections={SECTIONS}
                        stepHeight={STEP}
                        height={HEIGHT_GRAPH}
                        maxValue={height}
                        yAxisColor={ThemesDark.colors.dark}
                        yAxisThickness={0}
                        rulesType="solid"
                        rulesColor="gray"
                        yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
                        yAxisTextNumberOfLines={1}
                        showXAxisIndices={true}
                        dataPointsRadius={0.5}
                        dataPointsShape={'circular'}
                        isAnimated={true}
                        showScrollIndicator={true}
                        scrollToEnd={true}
                        pointerConfig={{
                            pointerStripHeight: 100,
                            pointerStripColor: 'white',
                            pointerStripWidth: 2,
                            pointerColor: Themes.COLORS.red,
                            radius: 6,
                            pointerLabelWidth: 100,
                            pointerLabelHeight: 90,
                            showPointerStrip: true,
                            pointerStripUptoDataPoint: true,
                            activatePointersOnLongPress: true,
                            autoAdjustPointerLabelPosition: true,
                            pointerLabelComponent: (items: any) => {
                                return (
                                    <View
                                        style={{
                                            height: 80,
                                            width: 100,
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white',
                                                fontSize: 14,
                                                marginBottom: 6,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {items[0].date}
                                        </Text>

                                        <View
                                            style={{
                                                paddingHorizontal: 7,
                                                paddingVertical: 3,
                                                borderRadius: 16,
                                                backgroundColor: 'white',
                                            }}
                                        >
                                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                {`${items[0].value} VND`}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            },
                        }}
                    />
                    <View style={styles.bottomGraph}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <StyledText
                                originValue={`${closeList[0]?.date}`}
                                customStyle={{ color: 'gray', fontSize: 10 }}
                            />
                            <StyledText
                                originValue={`${closeList[closeList.length - 1]?.date}`}
                                customStyle={{ color: 'gray', fontSize: 10 }}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemesDark.colors.dark,
    },
    header: {
        height: '50@vs',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ThemesDark.colors.dark,
        borderBottomWidth: 0.5,
        borderColor: Themes.COLORS.white,
    },
    companyContainer: {
        paddingTop: 15,
        paddingBottom: 15,
        alignItems: 'center',
        margin: 0,
    },
    companyName: {
        fontSize: Size.FONTSIZE.normal,
        color: Themes.COLORS.white,
        margin: 5,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    sb: {
        fontSize: Size.FONTSIZE.normal,
        color: Themes.COLORS.white,
    },
    right: {
        width: '50@s',
    },
    title: {
        fontSize: '22@ms0.3',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    slide: {
        flexDirection: 'row',
        width: itemWidth,
        height: '120@vs',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },
    containerCustomStyle: {
        position: 'relative',
        // backgroundColor: 'red',
    },
    symbol: {
        fontSize: Size.FONTSIZE.large,
        color: Themes.COLORS.red,
    },
    prize: {
        fontSize: Size.FONTSIZE.large,
        color: Themes.COLORS.black,
    },
    volume: {
        fontSize: Size.FONTSIZE.large,
        color: Themes.COLORS.black,
    },
    calendar: {
        marginBottom: 10,
        borderRadius: 10,
    },
    bottomGraph: {},
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10,
    },
    icon: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
});
export default DetailStock;
