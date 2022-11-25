import React, { FunctionComponent } from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { Themes } from 'assets/themes';
import { useTranslation } from 'react-i18next';
import StyledText from './StyledText';
import StyledTouchable from './StyledTouchable';

interface StyledListNoDataProps {
    text?: string;
    canRefresh?: boolean;
    loading?: boolean;
    onRefresh?(): any;
    customStyle?: StyleProp<ViewStyle>;
    customStyleText?: StyleProp<TextStyle>;
}

const RELOAD = 'Reload';

const StyledNoData: FunctionComponent<StyledListNoDataProps> = (props: StyledListNoDataProps) => {
    const { t } = useTranslation();
    return (
        <View style={[styles.container, props.customStyle]}>
            {props.loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator />
                </View>
            ) : (
                <StyledText
                    i18nText={props.text || t('common.noData')}
                    customStyle={props.customStyleText || styles.noData}
                />
            )}
            {!!props.canRefresh && !props.loading ? (
                <StyledTouchable onPress={props.onRefresh}>
                    <StyledText i18nText={RELOAD} customStyle={styles.textReload} />
                </StyledTouchable>
            ) : (
                <View />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        flex: 1,
    },
    text: {
        fontWeight: '600',
        fontSize: 14,
        color: Themes.COLORS.primary,
        textAlign: 'center',
    },
    textReload: {
        margin: 12,
        color: Themes.COLORS.primary,
    },
    loadingContainer: {
        alignItems: 'center',
    },
    noData: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
});

export default StyledNoData;
