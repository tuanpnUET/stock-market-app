import React, { FunctionComponent } from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Themes } from 'assets/themes';
import { StyledText, StyledTouchable } from '.';

interface StyledButtonProps {
    title: string;
    customStyle?: StyleProp<ViewStyle>;
    onPress(params?: any): void;
    onLongPress?(): void;
    disabled?: boolean;
    customTextColor?: StyleProp<TextStyle>;
}

const StyledButton: FunctionComponent<StyledButtonProps> = (props: StyledButtonProps) => {
    const { title, customStyle, customTextColor, onPress, onLongPress, disabled = false } = props;
    return (
        <StyledTouchable
            customStyle={[styles.container, customStyle]}
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={disabled}
        >
            <StyledText i18nText={title} customStyle={customTextColor} />
        </StyledTouchable>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 42,
        width: 128,
        borderColor: Themes.COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
    },
});

export default StyledButton;
