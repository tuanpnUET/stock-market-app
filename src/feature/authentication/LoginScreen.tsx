/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { StyledButton, StyledText, StyledTouchable } from 'components/base';
import { AUTHENTICATE_ROUTE } from 'navigation/config/routes';
import { navigate } from 'navigation/NavigationService';
import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, ImageBackground, KeyboardAvoidingView, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useLogin } from 'utilities/authenticate/AuthenticateService';
import sizes from 'assets/sizes';
import metrics from 'assets/metrics';
import { Themes, ThemesDark } from 'assets/themes';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { requireField } from 'utilities/format';
import AlertMessage from 'components/base/AlertMessage';
import useLoading from 'components/base/modal/useLoading';
import StyledInputForm from 'components/base/StyledInputForm';
import images from 'assets/images';
import { regexEmail } from 'utilities/validate';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen: FunctionComponent = () => {
    const passwordRef = useRef<any>(null);
    const { t } = useTranslation();
    const { requestLogin } = useLogin();
    const loading = useLoading();

    const loginSchema = yup.object().shape({
        email: yup
            .string()
            .required(() => requireField('email'))
            .matches(regexEmail, t('validateMessage.emailInvalid')),
        password: yup
            .string()
            .required(() => requireField('password'))
            .test(
                'len',
                t('validateMessage.minLength', { len: 6 }),
                (val: string | undefined) => !!val && val.length >= 6,
            ),
    });
    const form = useForm({
        mode: 'onChange',
        resolver: yupResolver(loginSchema),
    });
    const {
        formState: { isValid },
        handleSubmit,
    } = form;
    const submit = async (user: any) => {
        try {
            loading.show();
            await requestLogin(user);
        } catch (err: any) {
            AlertMessage(err);
        } finally {
            loading.dismiss();
        }
    };
    const doRegister = () => {
        navigate(AUTHENTICATE_ROUTE.REGISTER);
    };
    const goToForgotPassword = () => {
        navigate(AUTHENTICATE_ROUTE.FORGOT_PASS);
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
        >
            <ImageBackground source={images.photo.first_screen.background} style={styles.body}>
                <View>
                    <StyledText customStyle={styles.title} i18nText="loginScreen.buttonLogin" />
                    <View style={styles.formLogin}>
                        <FormProvider {...form}>
                            <StyledInputForm
                                name="email"
                                label={t('loginScreen.labelEmail')}
                                placeholder={t('login.placeholderEmail')}
                                keyboardType="email-address"
                                returnKeyType={'next'}
                                onSubmitEditing={() => passwordRef.current.focus()}
                            />
                            <StyledInputForm
                                name="password"
                                label={t('loginScreen.labelPassword')}
                                placeholder={t('login.placeholderPassword')}
                                isPassword={true}
                                ref={passwordRef}
                                customHidePasswordImage={images.icons.hide_pass}
                                customShowPasswordImage={images.icons.show_pass}
                            />
                        </FormProvider>
                    </View>
                    <StyledText
                        onPress={goToForgotPassword}
                        customStyle={styles.forgotPassword}
                        i18nText="loginScreen.forgotPassword"
                    />
                </View>
                <View style={styles.bottomContent}>
                    <StyledButton
                        onPress={handleSubmit(submit)}
                        title={t('loginScreen.buttonLogin')}
                        customTextColor={styles.textBtn}
                        customStyle={styles.loginButton}
                    />
                    <View style={styles.bottomText}>
                        <StyledText customStyle={styles.dontHaveAnAccount} i18nText="loginScreen.dontHaveAnAccount" />
                        <StyledTouchable onPress={doRegister}>
                            <StyledText customStyle={styles.clickHere} i18nText="loginScreen.register" />
                        </StyledTouchable>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemesDark.colors.dark,
    },
    header: {
        height: 100,
        backgroundColor: ThemesDark.colors.strongDark,
    },
    body: {
        width: metrics.screenWidth,
        height: metrics.screenHeight,
        paddingLeft: 24,
        paddingRight: 24,
        alignSelf: 'center',
    },
    title: {
        top: 100,
        alignSelf: 'center',
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.mediumLarge,
        fontWeight: 'bold',
    },
    formLogin: {
        paddingTop: 150,
    },
    forgotPassword: {
        color: Themes.COLORS.white,
        textAlign: 'right',
    },
    bottomContent: {
        alignItems: 'center',
        position: 'absolute',
        left: 24,
        bottom: 50,
    },
    loginButton: {
        marginBottom: 10,
        width: metrics.screenWidth - 48,
        backgroundColor: Themes.COLORS.baseOrange,
        alignSelf: 'center',
        height: 52,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    dontHaveAnAccount: {
        textAlign: 'center',
        color: Themes.COLORS.white,
    },
    clickHere: {
        textAlign: 'center',
        color: Themes.COLORS.red,
        fontSize: sizes.FONTSIZE.normal,
    },
    bottomText: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        fontSize: sizes.FONTSIZE.normal,
    },
    textBtn: {
        color: Themes.COLORS.white,
        fontWeight: '800',
    },
});
export default LoginScreen;
