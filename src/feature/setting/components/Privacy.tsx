import { useNavigation } from '@react-navigation/native';
import Images from 'assets/images';
import { Themes, ThemesDark } from 'assets/themes';
import { StyledIcon, StyledImage, StyledText, StyledTouchable } from 'components/base';
import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

const Privacy = () => {
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
                <StyledText i18nText={'privacy.title'} customStyle={styles.title} />
                <View style={styles.right} />
            </View>
            <ScrollView style={styles.body}>
                <StyledText i18nText={'privacy.content'} customStyle={styles.content} />
                <StyledImage source={Images.photo.privacy} customStyle={styles.photo} />
                <StyledText i18nText={'privacy.subContent'} customStyle={styles.sub} />
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
    photo: {
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        height: '250@vs',
        borderRadius: 10,
    },
});
export default Privacy;
