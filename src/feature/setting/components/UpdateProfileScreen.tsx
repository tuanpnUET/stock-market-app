/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, useState, useEffect } from 'react';
import { ImageBackground, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { yupResolver } from '@hookform/resolvers/yup';
import { Themes, ThemesDark } from 'assets/themes';
import { StyledButton, StyledIcon, StyledImage, StyledText, StyledTouchable } from 'components/base';
import StyledInputForm from 'components/base/StyledInputForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { requireField } from 'utilities/format';
import { regexEmail, regexPhone } from 'utilities/validate';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app-redux/rootReducer';
import Images from 'assets/images';
import { useNavigation } from '@react-navigation/native';
import sizes from 'assets/sizes';
import metrics from 'assets/metrics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { updateProfile } from 'api/modules/api-app/authenticate';
import ImagePicker from 'utilities/upload/ImagePicker';
import useLoading from 'components/base/modal/useLoading';
import AlertMessage from 'components/base/AlertMessage';
import { setUserInfo } from 'app-redux/userInfo/actions';
import Toast from 'react-native-toast-message';

const noAvt = 'https://i.pinimg.com/originals/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.png';

const UpdateProfileScreen: FunctionComponent = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const { userInfo } = useSelector((state: RootState) => state);
    const loading = useLoading();
    const dispatch = useDispatch();
    const [newAvatar, setNewAvatar] = useState<string>(userInfo?.user?.avatar || '');
    const DEFAULT_FORM = {
        name: userInfo?.user?.name,
        phone: userInfo?.user?.phone ? `0${userInfo?.user?.phone.toString()}` : '',
        email: userInfo?.user?.email,
        avatar: userInfo?.user?.avatar || noAvt,
    };
    const schema = yup.object().shape({
        name: yup
            .string()
            .required(() => requireField('name'))
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
    });
    const form = useForm({
        mode: 'onChange',
        defaultValues: DEFAULT_FORM,
        resolver: yupResolver(schema),
        reValidateMode: 'onChange',
        criteriaMode: 'firstError', // first error from each field will be gathered.
    });
    const {
        formState: { isValid },
        reset,
        handleSubmit,
    } = form;
    useEffect(() => {
        setNewAvatar(newAvatar);
    }, [newAvatar]);
    const submit = async (user: any) => {
        const formRegister = {
            name: user.name,
            phone: user.phone,
            email: user.email,
            avatar: newAvatar !== '' ? newAvatar : userInfo?.user?.avatar,
        };
        try {
            loading.show();
            const res = await updateProfile(userInfo?.token, formRegister);
            // console.log('res', res);
            Toast.show({
                type: 'success',
                text1: t('toastMessage.updateProfileSuccess'),
            });
            dispatch(setUserInfo({ user: { ...userInfo?.user, ...formRegister } }));
            navigation.goBack();
        } catch (err: any) {
            AlertMessage(err);
        } finally {
            loading.dismiss();
        }
    };
    const onChangeName = (text: string) => {
        form.setValue('name', text, {
            shouldValidate: true,
        });
    };
    const onChangePhone = (text: string) => {
        form.setValue('phone', text, {
            shouldValidate: true,
        });
    };
    const onChangeEmail = (text: string) => {
        form.setValue('email', text, {
            shouldValidate: true,
        });
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={Images.photo.first_screen.background} style={styles.body}>
                <View style={styles.header}>
                    <StyledTouchable onPress={() => navigation.goBack()}>
                        <StyledIcon
                            size={50}
                            source={Images.icons.close}
                            customStyle={{ tintColor: Themes.COLORS.white }}
                        />
                    </StyledTouchable>
                    <StyledText i18nText={'settings.profile'} customStyle={styles.title} />
                    <View style={styles.right} />
                </View>
                <View style={styles.formRegister}>
                    <View>
                        <ImagePicker
                            customStyleImage={[styles.avatar]}
                            setImage={(path: string) => setNewAvatar(path)}
                            image={newAvatar}
                        >
                            <StyledImage
                                source={{
                                    uri: newAvatar,
                                }}
                                customStyle={[styles.avatar, styles.borderNonAvatar]}
                            />
                        </ImagePicker>
                    </View>
                    <FormProvider {...form}>
                        <StyledInputForm
                            name="name"
                            label={t('registerScreen.username')}
                            returnKeyType={'next'}
                            onChangeText={onChangeName}
                            // value={userInfo?.user?.name}
                        />
                        <StyledInputForm
                            name="phone"
                            label={t('registerScreen.phone')}
                            keyboardType={'number-pad'}
                            returnKeyType={'next'}
                            onChangeText={onChangePhone}
                            // value={userInfo?.user?.phone}
                        />
                        <StyledInputForm
                            name="email"
                            label={t('registerScreen.email')}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            onChangeText={onChangeEmail}
                            // value={userInfo?.user?.email}
                        />
                    </FormProvider>
                </View>
                <View style={styles.bottomContent}>
                    <StyledButton
                        disabled={!isValid}
                        onPress={handleSubmit(submit)}
                        title={t('updateProfile.update')}
                        customStyle={[styles.button, !isValid && { backgroundColor: ThemesDark.colors.primary }]}
                        customTextColor={styles.textBtn}
                    />
                    <View style={{ width: 5 }} />
                    <StyledTouchable
                        onPress={() => reset()}
                        customStyle={[styles.button, { backgroundColor: ThemesDark.colors.baseOrange }]}
                    >
                        <StyledText i18nText={t('updateProfile.reset')} customStyle={styles.textButton} />
                    </StyledTouchable>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: Themes.COLORS.white,
    },
    body: {
        flex: 1,
    },
    header: {
        // height: '50@vs',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ThemesDark.colors.dark,
        borderBottomWidth: 0.5,
        borderColor: Themes.COLORS.white,
        paddingTop: metrics.safeTopPadding,
    },
    right: {
        width: '50@s',
    },
    title: {
        fontSize: '22@ms0.3',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: Themes.COLORS.white,
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
    textButton: {
        color: 'white',
    },
    button: {
        width: (metrics.screenWidth - 50) / 2,
        marginTop: 5,
        backgroundColor: Themes.COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        height: 50,
    },
    formRegister: {
        top: '60@vs',
        width: metrics.screenWidth,
        alignSelf: 'center',
        paddingLeft: 24,
        paddingRight: 24,
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
    bottomContent: {
        position: 'absolute',
        bottom: '100@vs',
        alignItems: 'center',
        left: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    btn: {
        marginBottom: 10,
        width: metrics.screenWidth - 48,
        backgroundColor: Themes.COLORS.baseOrange,
        alignSelf: 'center',
        height: 52,
        borderRadius: 10,
        fontWeight: 'bold',
    },
    submitTxt: {
        color: Themes.COLORS.white,
        fontWeight: '800',
    },
});
export default UpdateProfileScreen;
