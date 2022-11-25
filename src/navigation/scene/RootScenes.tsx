import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Host } from 'react-native-portalize';
import { useSelector } from 'react-redux';
import { RootState } from 'app-redux/rootReducer';
import { useTranslation } from 'react-i18next';
import { APP_ROUTE } from '../config/routes';
import navigationConfigs from '../config/options';
import MainTabContainer from './TabScenes';
import AuthStack from './AuthScenes';

const MainStack = createStackNavigator();

const AppStack = () => (
    <Host>
        <MainStack.Navigator headerMode={'none'} screenOptions={navigationConfigs}>
            <MainStack.Screen name={APP_ROUTE.MAIN_TAB} component={MainTabContainer} />
        </MainStack.Navigator>
    </Host>
);

const Navigation: React.FunctionComponent = () => {
    const { userInfo } = useSelector((state: RootState) => state);
    const { i18n } = useTranslation();
    const { languageReducer } = useSelector((state: RootState) => state);

    useEffect(() => {
        if (languageReducer?.language) {
            i18n.changeLanguage(languageReducer.language);
        }
    }, [languageReducer?.language]);
    if (userInfo.token) {
        return <AppStack />;
    }
    return <AuthStack />;
};

export default Navigation;
