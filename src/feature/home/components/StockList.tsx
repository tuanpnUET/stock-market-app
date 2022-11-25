/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StyledList, StyledText } from 'components/base';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import metrics from 'assets/metrics';
import { Searchbar } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Images from 'assets/images';
import StockItem from './StockItem';

export const ListHeader = () => {
    return (
        <View style={styles.listHeader}>
            <View style={styles.headerItem}>
                <StyledText customStyle={{ fontWeight: 'bold' }} i18nText={'common.symbol'} />
            </View>
            <View style={styles.headerItem}>
                <StyledText customStyle={{ fontWeight: '600' }} i18nText={'common.open'} />
            </View>
            <View style={styles.headerItem}>
                <StyledText customStyle={{ fontWeight: '600' }} i18nText={'common.high'} />
            </View>
            <View style={styles.headerItem}>
                <StyledText customStyle={{ fontWeight: '600' }} i18nText={'common.low'} />
            </View>
            <View style={styles.headerItem}>
                <StyledText customStyle={{ fontWeight: '600' }} i18nText={'common.closeStock'} />
            </View>
            <View style={styles.headerItem}>
                <StyledText customStyle={{ fontWeight: 'bold' }} i18nText={'common.volume'} />
            </View>
        </View>
    );
};
interface StockProps {
    Symbol?: string;
    Open?: string;
    Close: string;
    Low: string;
    High: string;
    Volume: number;
    Date: string;
}
interface StockListProps {
    data: StockProps[];
}

const StockList: React.FC<StockListProps> = (props: StockListProps) => {
    const [symbolList, setSymbolList] = React.useState([...props?.data]) as any;
    const [loading, setLoading] = React.useState(true);
    const [txtSearch, setTxtSearch] = React.useState('');
    const { t } = useTranslation();
    useEffect(() => {
        setSymbolList(props?.data);
    }, [props?.data]);
    useEffect(() => {
        if (symbolList) setLoading(false);
        else setLoading(true);
    }, [symbolList]);

    const updateSearch = (search: string) => {
        setTxtSearch(search);
    };
    React.useEffect(() => {
        searchSymbol(txtSearch);
    }, [txtSearch]);

    const searchSymbol = (text: string) => {
        if (text === '') {
            setSymbolList(props?.data);
        } else {
            setSymbolList(symbolList?.filter((i: any) => i?.Symbol?.toLowerCase()?.includes(text?.toLowerCase())));
        }
    };
    return (
        <View style={styles.container}>
            <View style={{ paddingBottom: 5 }}>
                <Searchbar
                    // round={false}
                    icon={Images.icons.search}
                    clearIcon={Images.icons.close}
                    placeholder={t('common.search')}
                    onChangeText={updateSearch}
                    onIconPress={() => updateSearch}
                    value={txtSearch}
                    inputStyle={{ backgroundColor: '#EEEEEE', marginLeft: 12, borderRadius: 25, paddingLeft: 20 }}
                />
            </View>

            {loading ? (
                <View style={styles.spinner}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            ) : symbolList ? (
                <View style={{ paddingBottom: 200 }}>
                    <StyledList
                        data={symbolList}
                        ListHeaderComponent={ListHeader}
                        stickyHeaderIndices={[0]}
                        noDataText={t('common.noData')}
                        renderItem={({ item, index }: any) => <StockItem {...item} index={index} />}
                        keyExtractor={(item: any) => `${item?.date}-${item?.symbol}`}
                    />
                </View>
            ) : (
                <StyledText customStyle={{ fontWeight: '400', alignItems: 'center' }} i18nText={'common.notFound'} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // height: '200%',
    },
    listHeader: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: 'gainsboro',
    },
    headerItem: {
        margin: 3,
        width: metrics.screenWidth / 7,
    },
    spinner: {
        height: metrics.screenHeight / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default StockList;
