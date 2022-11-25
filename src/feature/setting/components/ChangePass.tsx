/* eslint-disable no-underscore-dangle */
import React, { FunctionComponent } from 'react';
import { ImageBackground, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { yupResolver } from '@hookform/resolvers/yup';
import { Themes, ThemesDark } from 'assets/themes';
import { StyledButton, StyledIcon, StyledText, StyledTouchable } from 'components/base';
import StyledInputForm from 'components/base/StyledInputForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { requireField } from 'utilities/format';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import sizes from 'assets/sizes';
import metrics from 'assets/metrics';
import useLoading from 'components/base/modal/useLoading';
import AlertMessage from 'components/base/AlertMessage';
import Toast from 'react-native-toast-message';
import images from 'assets/images';
import { store } from 'app-redux/store';
import { logOutUser } from 'app-redux/userInfo/actions';
import { useSelector } from 'react-redux';
import { RootState } from 'app-redux/rootReducer';
import { updatePassword } from 'api/modules/api-app/authenticate';

const ChangePass: FunctionComponent = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const loading = useLoading();
    const { userInfo } = useSelector((state: RootState) => state);
    const schema = yup.object().shape({
        oldPass: yup
            .string()
            .required(() => requireField('oldPass'))
            .test(
                'len',
                t('validateMessage.minLength', { len: 6 }),
                (val: string | undefined) => !!val && val.length >= 6,
            ),
        newPass: yup
            .string()
            .required(() => requireField('newPass'))
            .test(
                'len',
                t('validateMessage.minLength', { len: 6 }),
                (val: string | undefined) => !!val && val.length >= 6,
            ),
        confirmPass: yup
            .string()
            .required(() => requireField('confirmPass'))
            .oneOf([yup.ref('newPass'), null], t('validateMessage.notMatchPassword')),
    });
    const form = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        reValidateMode: 'onChange',
        criteriaMode: 'firstError', // first error from each field will be gathered.
    });
    const {
        formState: { isValid },
        reset,
        handleSubmit,
    } = form;
    const submit = async (formData: any) => {
        const formRegister = {
            oldPassword: formData.oldPass,
            id: userInfo?.user?._id,
            newPassword: formData.newPass,
        };
        try {
            loading.show();
            // change pass api
            await updatePassword(userInfo?.token, formRegister);
            Toast.show({
                type: 'success',
                text1: t('toastMessage.changeSuccess'),
            });
            store.dispatch(logOutUser());
        } catch (err: any) {
            AlertMessage(err);
        } finally {
            loading.dismiss();
        }
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={images.photo.first_screen.background} style={styles.body}>
                <View style={styles.header}>
                    <StyledTouchable onPress={() => navigation.goBack()}>
                        <StyledIcon
                            size={50}
                            source={images.icons.close}
                            customStyle={{ tintColor: Themes.COLORS.white }}
                        />
                    </StyledTouchable>
                    <StyledText i18nText={'settings.changePass'} customStyle={styles.title} />
                    <View style={styles.right} />
                </View>
                <View style={styles.formRegister}>
                    <FormProvider {...form}>
                        <StyledInputForm
                            name="oldPass"
                            label={t('changePass.oldPass')}
                            returnKeyType={'next'}
                            isPassword={true}
                            customHidePasswordImage={images.icons.hide_pass}
                            customShowPasswordImage={images.icons.show_pass}
                        />
                        <StyledInputForm
                            name="newPass"
                            label={t('changePass.newPass')}
                            returnKeyType={'next'}
                            isPassword={true}
                            customHidePasswordImage={images.icons.hide_pass}
                            customShowPasswordImage={images.icons.show_pass}
                        />
                        <StyledInputForm
                            name="confirmPass"
                            label={t('changePass.confirmPass')}
                            keyboardType={'email-address'}
                            returnKeyType={'next'}
                            isPassword={true}
                            customHidePasswordImage={images.icons.hide_pass}
                            customShowPasswordImage={images.icons.show_pass}
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
        top: '120@vs',
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
export default ChangePass;
