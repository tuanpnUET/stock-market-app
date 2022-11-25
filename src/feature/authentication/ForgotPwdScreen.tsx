import { getVerifyCode } from 'api/modules/api-app/authenticate';
import images from 'assets/images';
import metrics from 'assets/metrics';
import sizes from 'assets/sizes';
import { Themes } from 'assets/themes';
import { StyledButton, StyledText } from 'components/base';
import AlertMessage from 'components/base/AlertMessage';
import StyledInputForm from 'components/base/StyledInputForm';
import { AUTHENTICATE_ROUTE } from 'navigation/config/routes';
import { navigate } from 'navigation/NavigationService';
import React, { FunctionComponent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requireField } from 'utilities/format';
import { regexEmail } from 'utilities/validate';

const SendEmailScreen: FunctionComponent = () => {
    const { t } = useTranslation();
    const form = useForm({
        mode: 'all',
    });
    const {
        handleSubmit,
        formState: { isValid },
    } = form;
    const onChangeEmail = (text: string) => {
        form.setValue('email', text, {
            shouldValidate: true,
        });
    };
    const confirm = async ({ email }: any) => {
        try {
            const params = {
                email,
            };
            const res: any = await getVerifyCode(params);
            if (res?.status === 1) {
                AlertMessage(res?.message);
                navigate(AUTHENTICATE_ROUTE.SEND_OTP, { email });
            }
        } catch (error: any) {
            AlertMessage(error);
        }
    };
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.container}
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
        >
            <ImageBackground source={images.photo.first_screen.background} style={styles.body}>
                <StyledText customStyle={styles.title} i18nText={t('forgotPass.title')} />
                <StyledText customStyle={styles.subTitle} i18nText={t('forgotPass.subTitle')} />
                <View style={styles.form}>
                    <FormProvider {...form}>
                        <StyledInputForm
                            label={'Email'}
                            name={'email'}
                            placeholder={t('register.emailPlaceholder')}
                            keyboardType="email-address"
                            returnKeyType={'next'}
                            onChangeText={onChangeEmail}
                            form={form}
                            rules={{
                                pattern: {
                                    value: regexEmail,
                                    message: t('validateMessage.emailInvalid'),
                                },
                                required: requireField('email'),
                            }}
                        />
                    </FormProvider>
                    <View style={styles.bottomContent}>
                        <StyledButton
                            title={'forgotPass.next'}
                            onPress={handleSubmit(confirm)}
                            customStyle={[styles.buttonSave, !isValid && { backgroundColor: 'lightgray' }]}
                            disabled={!isValid}
                        />
                    </View>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    titleStyleSaveButton: {
        color: Themes.COLORS.white,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    contentContainer: {
        alignItems: 'center',
    },
    content: {
        backgroundColor: Themes.COLORS.white,
        borderRadius: 10,
        paddingHorizontal: 30,
        marginTop: 15,
        marginBottom: 30,
        paddingVertical: 40,
    },
    header: {
        marginVertical: 10,
    },
    buttonSave: {
        marginTop: 20,
        backgroundColor: Themes.COLORS.baseOrange,
        borderWidth: 1,
        borderColor: Themes.COLORS.yellow,
    },
    body: {
        width: metrics.screenWidth,
        height: metrics.screenHeight,
        paddingLeft: 24,
        paddingRight: 24,
        alignSelf: 'center',
    },
    title: {
        top: 50,
        alignSelf: 'center',
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.mediumLarge,
        fontWeight: 'bold',
    },
    subTitle: {
        top: 80,
        color: Themes.COLORS.white,
        fontSize: sizes.FONTSIZE.normal,
    },
    form: {
        top: 100,
    },
    bottomContent: {
        paddingTop: 50,
        position: 'absolute',
        right: 0,
    },
});
export default SendEmailScreen;
