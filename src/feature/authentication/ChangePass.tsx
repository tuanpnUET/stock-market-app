/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
// import { resetPassword } from 'api/modules/api-app/authenticate';
import { Themes } from 'assets/themes';
import { StyledButton } from 'components/base';
import AlertMessage from 'components/base/AlertMessage';
import StyledInputForm from 'components/base/StyledInputForm';
import { AUTHENTICATE_ROUTE } from 'navigation/config/routes';
import { navigate } from 'navigation/NavigationService';
import React, { FunctionComponent, useRef } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requireField } from 'utilities/format';
import { isIos } from 'utilities/helper';
import * as yup from 'yup';

const ChangePassword: FunctionComponent = ({ route }: any) => {
    const { t } = useTranslation();
    const changePassSchema = yup.object().shape({
        oldPass: yup.string().required(() => requireField('Old Password')),
        newPass: yup
            .string()
            .required(() => requireField('New Password'))
            .test(
                'len',
                t('validateMessage.minLength', { len: 6 }),
                (val: string | undefined) => !!val && val.length >= 6,
            ),
        confirmNewPass: yup
            .string()
            .required(() => requireField('Confirm New Password'))
            .oneOf([yup.ref('newPass'), null], 'validateMessage.notMatchPassword'),
    });
    const form = useForm({
        mode: 'all',
        resolver: yupResolver(changePassSchema),
    });
    const {
        handleSubmit,
        formState: { isValid },
    } = form;
    const passwordConfirmRef = useRef<TextInput>(null);
    const newPassRef = useRef<TextInput>(null);
    const { email } = route?.params || {};
    const confirm = async ({ newPass }: any) => {
        try {
            // await resetPassword(email, newPass, code);
            navigate(AUTHENTICATE_ROUTE.LOGIN);
        } catch (error: any) {
            AlertMessage(error);
        }
    };

    return (
        <View style={styles.flex1}>
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    style={styles.content}
                    contentContainerStyle={styles.contentContainer}
                    enableOnAndroid={true}
                    enableAutomaticScroll={isIos}
                    showsVerticalScrollIndicator={false}
                >
                    <FormProvider {...form}>
                        <StyledInputForm
                            label={''}
                            name={'oldPass'}
                            placeholder={t('registerAccount.passwordPlaceholder')}
                            maxLength={32}
                            onSubmitEditing={() => newPassRef?.current?.focus()}
                        />
                        <StyledInputForm
                            label={''}
                            name={'newPass'}
                            ref={newPassRef}
                            placeholder={t('registerAccount.passwordPlaceholder')}
                            secureTextEntry={true}
                            returnKeyType={'next'}
                            maxLength={32}
                            onSubmitEditing={() => passwordConfirmRef?.current?.focus()}
                        />
                        <StyledInputForm
                            label={''}
                            name={'confirmNewPass'}
                            ref={passwordConfirmRef}
                            placeholder={t('registerAccount.passwordPlaceholder')}
                            secureTextEntry={true}
                            returnKeyType={'next'}
                            maxLength={32}
                            onSubmitEditing={handleSubmit(confirm)}
                        />
                    </FormProvider>
                    <StyledButton
                        title={'register.confirm'}
                        onPress={handleSubmit(confirm)}
                        disabled={!isValid}
                        customStyle={[styles.buttonSave, !isValid && { backgroundColor: 'lightgray' }]}
                    />
                </KeyboardAwareScrollView>
            </View>
        </View>
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
    flex1: {
        flex: 1,
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
        backgroundColor: Themes.COLORS.white,
        marginTop: 30,
    },
});
export default ChangePassword;
