/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { register } from 'api/modules/api-app/authenticate';
import { StyledButton, StyledImage, StyledText, StyledTouchable } from 'components/base';
import { AUTHENTICATE_ROUTE } from 'navigation/config/routes';
import { navigate } from 'navigation/NavigationService';
import React, { FunctionComponent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, View } from 'react-native';
import sizes from 'assets/sizes';
import metrics from 'assets/metrics';
import { Themes, ThemesDark } from 'assets/themes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useLoading from 'components/base/modal/useLoading';
import * as yup from 'yup';
import AlertMessage from 'components/base/AlertMessage';
import { FormProvider, useForm } from 'react-hook-form';
import StyledInputForm from 'components/base/StyledInputForm';
import { requireField } from 'utilities/format';
import { regexEmail, regexPhone } from 'utilities/validate';
import images from 'assets/images';
import ImagePicker from 'utilities/upload/ImagePicker';
import { ScaledSheet } from 'react-native-size-matters';

const RegisterScreen: FunctionComponent = () => {
    const { t } = useTranslation();
    const loading = useLoading();
    const [avatar, setAvatar] = useState<string>();
    const phoneRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const passwordRef = useRef<any>(null);
    const confirmPassRef = useRef<any>(null);
    const registerSchema = yup.object().shape({
        username: yup
            .string()
            .required(() => requireField('username'))
            .test(
                'len',
                t('validateMessage.nameRequired', { len: 6 }),
                (val: string | undefined) => !!val && val.length >= 6,
            ),
        phone: yup
            .string()
            .required(() => requireField('phone'))
            .matches(regexPhone, t('validateMessage.phoneInvalid')),
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
        confirmPassword: yup
            .string()
            .required(() => requireField('confirmPassword'))
            .oneOf([yup.ref('password'), null], t('validateMessage.notMatchPassword')),
    });
    const form = useForm({
        mode: 'onChange',
        resolver: yupResolver(registerSchema),
    });
    const {
        formState: { isValid },
        handleSubmit,
    } = form;
    const submit = async (user: any) => {
        const formRegister = {
            name: user.username,
            phone: user.phone,
            email: user.email,
            password: user.password,
            avatar,
        };
        try {
            loading.show();
            await register(formRegister);
            AlertMessage(t('validateMessage.success'));
            navigate(AUTHENTICATE_ROUTE.LOGIN);
        } catch (err: any) {
            AlertMessage(err);
        } finally {
            loading.dismiss();
        }
    };

    const doLogin = () => {
        navigate(AUTHENTICATE_ROUTE.LOGIN);
    };
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <ImageBackground source={images.photo.first_screen.background} style={styles.body}>
                <StyledText customStyle={styles.title} i18nText="registerScreen.title" />
                <View style={styles.formRegister}>
                    <View>
                        <ImagePicker
                            customStyleImage={[styles.avatar]}
                            setImage={(path: string) => setAvatar(path)}
                            image={avatar}
                        >
                            <StyledImage
                                source={{
                                    uri:
                                        avatar ||
                                        'https://i.pinimg.com/originals/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.png',
                                }}
                                customStyle={[styles.avatar, styles.borderNonAvatar]}
                            />
                        </ImagePicker>
                    </View>
                    <FormProvider {...form}>
                        <StyledInputForm
                            name="username"
                            label={t('registerScreen.username')}
                            returnKeyType={'next'}
                            onSubmitEditing={() => phoneRef.current.focus()}
                        />
                        <StyledInputForm
                            name="password"
                            label={t('registerScreen.password')}
                            isPassword={true}
                            ref={passwordRef}
                            customHidePasswordImage={images.icons.hide_pass}
                            customShowPasswordImage={images.icons.show_pass}
                        />
                        <StyledInputForm
                            name="phone"
                            label={t('registerScreen.phone')}
                            keyboardType={'number-pad'}
                            returnKeyType={'next'}
                            onSubmitEditing={() => emailRef.current.focus()}
                        />
                        <StyledInputForm
                            name="email"
                            label={t('registerScreen.email')}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            onSubmitEditing={() => passwordRef.current.focus()}
                        />

                        <StyledInputForm
                            name="confirmPassword"
                            isPassword={true}
                            label={t('registerScreen.confirm_password')}
                            customHidePasswordImage={images.icons.hide_pass}
                            customShowPasswordImage={images.icons.show_pass}
                            ref={confirmPassRef}
                        />
                    </FormProvider>
                </View>
                <View style={styles.bottomContent}>
                    <StyledButton
                        onPress={handleSubmit(submit)}
                        title={t('registerScreen.title')}
                        customStyle={styles.registerButton}
                        customTextColor={styles.textBtn}
                    />
                    <View style={styles.bottomText}>
                        <StyledText customStyle={styles.haveAnAccount} i18nText="registerScreen.haveAnAccount" />
                        <StyledTouchable onPress={doLogin}>
                            <StyledText customStyle={styles.login} i18nText="common.login" />
                        </StyledTouchable>
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemesDark.colors.dark,
    },
    body: {
        width: metrics.screenWidth,
        alignSelf: 'center',
        paddingLeft: 24,
        paddingRight: 24,
        height: metrics.screenHeight,
    },
    avatar: {
        width: '120@s',
        height: '120@s',
        borderRadius: '60@s',
        borderWidth: 5,
        borderColor: Themes.COLORS.baseOrange,
        alignSelf: 'center',
        marginBottom: 20,
    },
    borderNonAvatar: {
        borderColor: Themes.COLORS.gray,
    },
    formRegister: {
        top: 40,
    },
    title: {
        top: 30,
        alignSelf: 'center',
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.mediumLarge,
        fontWeight: 'bold',
    },
    bottomContent: {
        position: 'absolute',
        bottom: 40,
        alignItems: 'center',
        left: 24,
    },
    registerButton: {
        marginBottom: 10,
        width: metrics.screenWidth - 48,
        backgroundColor: Themes.COLORS.baseOrange,
        alignSelf: 'center',
        height: 52,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    haveAnAccount: {
        textAlign: 'center',
        color: Themes.COLORS.white,
    },
    login: {
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
export default RegisterScreen;
