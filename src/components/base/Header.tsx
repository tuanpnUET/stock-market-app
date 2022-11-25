import Images from 'assets/images';
import Metrics from 'assets/metrics';
import { Themes, ThemesDark } from 'assets/themes';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import { navigate } from 'navigation/NavigationService';
import React from 'react';
import { View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import StyledIcon from './StyledIcon';
import StyledText from './StyledText';
import StyledTouchable from './StyledTouchable';

const Header = () => {
    return (
        <View style={styles.header}>
            <StyledTouchable onPress={() => navigate(TAB_NAVIGATION_ROOT.HOME_ROUTE.HOME)}>
                <StyledIcon source={Images.icons.logo} size={35} />
            </StyledTouchable>
            <StyledText i18nText={'common.stockMarket'} customStyle={styles.titleText} />
            <StyledTouchable
                customStyle={styles.center}
                onPress={() => navigate(TAB_NAVIGATION_ROOT.SETTING_ROUTE.ROOT)}
            >
                <StyledIcon source={Images.icons.menu} size={20} customStyle={styles.icon} />
            </StyledTouchable>
        </View>
    );
};
const styles = ScaledSheet.create({
    header: {
        paddingTop: Metrics.safeTopPadding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5@s',
        backgroundColor: ThemesDark.colors.dark,
        borderWidth: 0.3,
        borderBottomColor: 'gray',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '50@vs',
        height: '50@vs',
    },
    titleText: {
        fontSize: '22@ms0.3',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Themes.COLORS.white,
    },
    icon: {
        tintColor: Themes.COLORS.white,
    },
});

export default Header;
