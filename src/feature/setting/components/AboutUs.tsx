import { useNavigation } from '@react-navigation/native';
import Images from 'assets/images';
import { Themes, ThemesDark } from 'assets/themes';
import { StyledIcon, StyledText, StyledTouchable } from 'components/base';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const AboutUs = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <StyledTouchable onPress={() => navigation.goBack()}>
                    <StyledIcon
                        size={50}
                        source={Images.icons.close}
                        customStyle={{ tintColor: Themes.COLORS.white }}
                    />
                </StyledTouchable>
                <StyledText i18nText={'aboutUs.title'} customStyle={styles.title} />
                <View style={styles.right} />
            </View>
        </SafeAreaView>
    );
};
const styles = ScaledSheet.create({
    container: {
        flex: 1,
        backgroundColor: ThemesDark.colors.dark,
    },
    header: {
        height: '50@vs',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: ThemesDark.colors.dark,
    },
    right: {
        width: '50@s',
    },
    title: {
        fontSize: '22@ms0.3',
        alignSelf: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
});
export default AboutUs;
