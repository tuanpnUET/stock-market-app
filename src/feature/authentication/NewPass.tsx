/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent } from 'react';
import { ImageBackground, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { yupResolver } from '@hookform/resolvers/yup';
import { Themes, ThemesDark } from 'assets/themes';
import { StyledButton, StyledText } from 'components/base';
import StyledInputForm from 'components/base/StyledInputForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { requireField } from 'utilities/format';
import * as yup from 'yup';
import sizes from 'assets/sizes';
import metrics from 'assets/metrics';
import { SafeAreaView } from 'react-native-safe-area-context';
import useLoading from 'components/base/modal/useLoading';
import AlertMessage from 'components/base/AlertMessage';
import Toast from 'react-native-toast-message';
import images from 'assets/images';
import { navigate } from 'navigation/NavigationService';
import { AUTHENTICATE_ROUTE } from 'navigation/config/routes';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updatePasswordWhenForgot } from 'api/modules/api-app/authenticate';

const NewPass: FunctionComponent = ({ route }: any) => {
    const { t } = useTranslation();
    const loading = useLoading();
    const schema = yup.object().shape({
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
    const { handleSubmit } = form;
    const submit = async (formData: any) => {
        try {
            const params = {
                email: route?.params?.email,
                newPassword: formData.newPass,
            };
            loading.show();
            // change pass ap
            const res: any = await updatePasswordWhenForgot(params);
            if (res?.status === 1) {
                Toast.show({
                    type: 'success',
                    text1: t('toastMessage.changeSuccess'),
                });
                navigate(AUTHENTICATE_ROUTE.LOGIN);
            } else {
                Toast.show({
                    type: 'error',
                    text1: res?.message,
                });
            }
        } catch (err: any) {
            AlertMessage(err);
        } finally {
            loading.dismiss();
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
        >
            <ImageBackground source={images.photo.first_screen.background} style={styles.body}>
                <StyledText i18nText={'common.newPass'} customStyle={styles.title} />
                <View style={styles.formRegister}>
                    <FormProvider {...form}>
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
                            returnKeyType={'next'}
                            isPassword={true}
                            customHidePasswordImage={images.icons.hide_pass}
                            customShowPasswordImage={images.icons.show_pass}
                        />
                    </FormProvider>
                </View>
                <StyledButton
                    onPress={handleSubmit(submit)}
                    title={t('updateProfile.update')}
                    customStyle={[styles.button]}
                    customTextColor={styles.textBtn}
                />
            </ImageBackground>
        </KeyboardAwareScrollView>
    );
};

const styles = ScaledSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    body: {
        width: metrics.screenWidth,
        height: metrics.screenHeight,
        paddingLeft: 24,
        paddingRight: 24,
        alignSelf: 'center',
    },
    title: {
        top: 80,
        fontSize: sizes.FONTSIZE.mediumLarge,
        fontWeight: 'bold',
        alignSelf: 'center',
        color: Themes.COLORS.white,
    },
    button: {
        width: (metrics.screenWidth - 50) / 2,
        marginTop: 5,
        backgroundColor: Themes.COLORS.baseOrange,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 5,
        height: 50,
        top: 200,
        alignSelf: 'center',
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
});
export default NewPass;
