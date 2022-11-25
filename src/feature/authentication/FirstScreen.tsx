import React, { FunctionComponent } from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { navigate } from 'navigation/NavigationService';
import { StyledButton, StyledText, StyledTouchable } from 'components/base';
import { useTranslation } from 'react-i18next';
import { AUTHENTICATE_ROUTE } from 'navigation/config/routes';
import images from 'assets/images';
import sizes from 'assets/sizes';
import metrics from 'assets/metrics';
import { Themes } from 'assets/themes';

const FirstScreen: FunctionComponent = () => {
    const { t } = useTranslation();
    const doLogin = () => {
        navigate(AUTHENTICATE_ROUTE.LOGIN);
    };
    const doRegister = () => {
        navigate(AUTHENTICATE_ROUTE.REGISTER);
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.centerContent}>
                <ImageBackground source={images.photo.first_screen.background} style={styles.image}>
                    <View style={styles.centerContent}>
                        <StyledText customStyle={styles.brand} i18nText="firstScreen.brand" />
                        <StyledText customStyle={styles.description} i18nText="firstScreen.description" />
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.bottomContent}>
                <StyledButton
                    onPress={doRegister}
                    customTextColor={styles.textBtn}
                    customStyle={styles.gettingStartedBtn}
                    title={t('firstScreen.gettingStarted')}
                />
                <View style={styles.bottomText}>
                    <StyledText i18nText={t('common.haveAnAcc')} customStyle={styles.haveAnAcc} />
                    <StyledTouchable onPress={doLogin}>
                        <StyledText i18nText={t('common.login')} customStyle={styles.login} />
                    </StyledTouchable>
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    image: {
        width: metrics.screenWidth,
        height: metrics.screenHeight,
        justifyContent: 'center',
        flex: 1,
        resizeMode: 'cover',
    },
    centerContent: {
        alignSelf: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.mediumLarge,
    },
    brand: {
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.extraLarge,
        fontWeight: 'bold',
    },
    description: {
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.medium,
        top: 80,
        fontWeight: '400',
        textAlign: 'center',
    },
    bottomContent: {
        flex: 1,
        justifyContent: 'flex-end',
        bottom: 50,
    },
    gettingStartedBtn: {
        marginBottom: 10,
        backgroundColor: Themes.COLORS.baseOrange,
        alignSelf: 'center',
        width: 327,
        height: 52,
        borderRadius: 10,
    },
    textBtn: {
        color: Themes.COLORS.white,
        fontWeight: '800',
    },
    haveAnAcc: {
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.normal,
    },
    login: {
        color: Themes.COLORS.red,
        fontSize: sizes.FONTSIZE.normal,
    },
    bottomText: {
        flexDirection: 'row',
        height: 30,
        top: 10,
        justifyContent: 'center',
    },
});
export default FirstScreen;
