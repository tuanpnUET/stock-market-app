import { useNavigation } from '@react-navigation/native';
import Images from 'assets/images';
import { Themes, ThemesDark } from 'assets/themes';
import { StyledIcon, StyledText, StyledTouchable } from 'components/base';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const Term = () => {
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
                <StyledText i18nText={'term.title'} customStyle={styles.title} />
                <View style={styles.right} />
            </View>
            <ScrollView style={styles.body}>
                <StyledText i18nText={'term.requireAge'} customStyle={styles.content} />
                <StyledText i18nText={'term.contentAge'} customStyle={styles.sub} />
                <StyledText i18nText={'term.requireRespect'} customStyle={styles.content} />
                <StyledText i18nText={'term.contentRes'} customStyle={styles.sub} />
                <StyledText i18nText={'term.requireRule'} customStyle={styles.content} />
                <StyledText i18nText={'term.contentRule'} customStyle={styles.sub} />
            </ScrollView>
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
        borderBottomWidth: 0.5,
        borderColor: Themes.COLORS.white,
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
    body: {
        paddingTop: 10,
        margin: 10,
    },
    content: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: '18@ms0.3',
    },
    sub: {
        color: 'white',
        fontSize: '17@ms0.3',
        paddingBottom: 10,
    },
});
export default Term;
