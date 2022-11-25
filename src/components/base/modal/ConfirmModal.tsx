import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { StyledText } from 'components/base';
import Metrics from 'assets/metrics';
import { Themes } from 'assets/themes';

const ConfirmModal = ({
    modal,
    text,
    contentText,
    onConfirm,
    confirmButtonStyle,
    confirmText,
    cancelText,
    i18nParams,
    onCancel,
    showCancel = true,
}: any) => {
    return (
        <View style={styles.contModalContent}>
            <StyledText i18nText={text} customStyle={styles.text} />
            {!!contentText && (
                <StyledText i18nText={contentText} i18nParams={i18nParams} customStyle={styles.contentText} />
            )}
            <View style={styles.buttonView}>
                <TouchableOpacity
                    onPress={() => {
                        onConfirm();
                        modal.dismissAll();
                    }}
                    style={[styles.buttonConfirm]}
                >
                    <StyledText
                        i18nText={confirmText || 'common.delete'}
                        customStyle={[styles.buttonText, confirmButtonStyle]}
                    />
                </TouchableOpacity>
                {showCancel && (
                    <TouchableOpacity
                        onPress={() => {
                            modal.dismissAll();
                            onCancel?.();
                        }}
                        style={[styles.buttonConfirm]}
                    >
                        <StyledText i18nText={cancelText || 'common.cancel'} customStyle={[styles.buttonText]} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    contModalContent: {
        width: Metrics.screenWidth * 0.8,
        backgroundColor: Themes.COLORS.white,
        alignSelf: 'center',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    text: {
        fontSize: '17@ms0.3',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '18@vs',
        marginBottom: 10,
    },
    contentText: {
        fontSize: '15@ms0.3',
        textAlign: 'center',
        width: '80%',
        marginBottom: 10,
    },
    buttonView: {
        width: '100%',
    },
    buttonConfirm: {
        backgroundColor: Themes.COLORS.white,
        width: '100%',
        borderWidth: 0,
        borderTopWidth: 0.3,
        paddingVertical: 8,
        borderColor: Themes.COLORS.black,
    },
    buttonText: {
        fontSize: '17@ms0.3',
        color: Themes.COLORS.primary,
        textAlign: 'center',
    },
});

export default ConfirmModal;
