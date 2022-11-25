/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
import sizes from 'assets/sizes';
import { Themes } from 'assets/themes';
import React, { forwardRef, useState } from 'react';
import { Controller, RegisterOptions, useFormContext, UseFormMethods } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Keyboard, StyleSheet, Text } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { logger } from 'utilities/logger';
import StyledInput, { StyledInputProps } from './StyledInput';

interface FormInputProps extends StyledInputProps {
    name: string;
    rules?: RegisterOptions;
    defaultValue?: string;
    form?: UseFormMethods;
    isPassword?: boolean;
    label: string;
    value?: string;
    customShowPasswordImage?: any;
    customHidePasswordImage?: any;
}

const StyledInputForm = forwardRef((props: FormInputProps) => {
    const { t } = useTranslation();
    const [focused, setFocused] = useState(false);
    const {
        label,
        customShowPasswordImage,
        customHidePasswordImage,
        isPassword,
        name,
        rules,
        defaultValue = '',
        onChangeText,
        form,
        value,
    } = props;
    const formContext = useFormContext();
    if (!(formContext || form)) {
        logger(t('input.errorComponent'), true, '');
        return <StyledInput errorMessage={'input.errorComponent'} editable={false} />;
    }
    const { control, errors } = formContext || form;
    const errorMessage = errors?.[name]?.message || '';
    const onChangeInput = (text: string, onChangeControl: any) => {
        onChangeText ? onChangeText(text) : onChangeControl(text);
    };
    return (
        <Controller
            value={value}
            control={control}
            name={name}
            label={label}
            defaultValue={defaultValue}
            rules={rules}
            render={({ onChange, value }: any) => {
                return (
                    <>
                        <FloatingLabelInput
                            containerStyles={focused ? styles.containerInputFocused : styles.containerInput}
                            labelStyles={styles.label}
                            inputStyles={styles.input}
                            onFocus={() => {
                                setFocused(true);
                            }}
                            onBlur={() => {
                                setFocused(false);
                            }}
                            isFocused={focused}
                            label={label}
                            value={value}
                            isPassword={isPassword}
                            customShowPasswordImage={customShowPasswordImage}
                            customHidePasswordImage={customHidePasswordImage}
                            darkTheme={false}
                            onChangeText={(text: string) => onChangeInput(text, onChange)}
                            // onSubmitEditing={Keyboard.dismiss}
                        />
                        <Text style={styles.error}>{errorMessage}</Text>
                    </>
                );
            }}
        />
    );
});
const styles = StyleSheet.create({
    label: {
        paddingTop: 0,
        paddingLeft: 5,
        fontSize: sizes.FONTSIZE.large,
    },
    labelIsFocused: {
        marginTop: 20,
        paddingLeft: 5,
        fontSize: sizes.FONTSIZE.large,
    },
    input: {
        bottom: -10,
        paddingLeft: 10,
        fontSize: sizes.FONTSIZE.large,
    },
    containerInput: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        backgroundColor: Themes.COLORS.white,
    },
    containerInputFocused: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        backgroundColor: Themes.COLORS.white,
        borderWidth: 1,
        borderColor: Themes.COLORS.darkOrange,
    },
    error: {
        marginTop: 3,
        marginBottom: 5,
        fontSize: sizes.FONTSIZE.small,
        color: Themes.COLORS.borderInputError,
    },
});

export default StyledInputForm;
