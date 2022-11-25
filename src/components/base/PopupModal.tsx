import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';
import { StyledText } from 'components/base';
import Metrics from 'assets/metrics';
import { Themes } from 'assets/themes';

const PopupModal = ({ onPressLeftButton, onPressRightButton }: any) => {
    return (
        <View style={styles.contModalContent}>
            <StyledText i18nText={'registerScreen.selectPhoto'} customStyle={styles.selectPhoto} />
            <StyledText i18nText={'registerScreen.chooseImage'} customStyle={styles.chooseImage} />
            <View style={styles.buttonView}>
                <TouchableOpacity onPress={onPressLeftButton} style={[styles.buttonConfirm]}>
                    <StyledText i18nText={'registerScreen.camera'} customStyle={[styles.buttonText]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressRightButton} style={[styles.buttonConfirm, styles.buttonAlbum]}>
                    <StyledText i18nText={'registerScreen.photo'} customStyle={[styles.buttonText]} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = ScaledSheet.create({
    contModalContent: {
        width: Metrics.screenWidth * 0.8,
        backgroundColor: Themes.COLORS.white,
        alignSelf: 'center',
        marginBottom: '10@vs',
        borderRadius: 10,
        alignItems: 'center',
        paddingTop: '10@vs',
    },
    text: {
        fontSize: '18@ms0.3',
        textAlign: 'center',
        marginVertical: '10@vs',
    },
    buttonView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '10@vs',
    },
    buttonConfirm: {
        width: '50%',
        paddingVertical: 10,
        borderTopWidth: 0.3,
        borderColor: Themes.COLORS.borderGray,
    },
    buttonAlbum: {
        borderLeftWidth: 0.3,
        borderColor: Themes.COLORS.borderGray,
    },
    buttonText: {
        fontSize: '18@ms0.3',
        color: Themes.COLORS.primary,
        textAlign: 'center',
    },
    selectPhoto: {
        fontSize: '18@ms0.3',
        fontWeight: 'bold',
    },
    chooseImage: {
        fontSize: '15@ms0.3',
        marginTop: '5@vs',
    },
});

export default PopupModal;
