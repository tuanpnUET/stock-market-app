import React from 'react';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Images from 'assets/images';
import { Themes } from 'assets/themes';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import { useTranslation } from 'react-i18next';
import { isIos } from 'utilities/helper';
// Screen
import HomeScreen from 'feature/home/HomeScreen';
import StyledTabBar from 'navigation/components/StyledTabBar';
import navigationConfigs from 'navigation/config/options';
import SettingScreen from 'feature/setting/SettingScreen';
import UpdateProfileScreen from 'feature/setting/components/UpdateProfileScreen';
import DetailStock from 'feature/home/components/DetailStock';
import WatchList from 'feature/watchlist/WatchList';
import NewsScreen from 'feature/news/NewsScreen';
import CourseScreen from 'feature/course/CourseScreen';
import ChangePass from 'feature/setting/components/ChangePass';
import AboutUs from 'feature/setting/components/AboutUs';
import Privacy from 'feature/setting/components/Privacy';
import Term from 'feature/setting/components/Term';

const MainStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

const HomeStack = () => (
    <MainStack.Navigator headerMode={'none'} screenOptions={navigationConfigs} keyboardHandlingEnabled={isIos}>
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.HOME_ROUTE.HOME} component={HomeScreen} />
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.HOME_ROUTE.DETAIL_STOCK} component={DetailStock} />
    </MainStack.Navigator>
);

const SettingStack = () => (
    <MainStack.Navigator headerMode={'none'} screenOptions={navigationConfigs} keyboardHandlingEnabled={isIos}>
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.SETTING_ROUTE.ROOT} component={SettingScreen} />
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.SETTING_ROUTE.UPDATE_PROFILE} component={UpdateProfileScreen} />
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.SETTING_ROUTE.CHANGE_PASS} component={ChangePass} />
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.SETTING_ROUTE.ABOUT_US} component={AboutUs} />
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.SETTING_ROUTE.PRIVACY} component={Privacy} />
        <MainStack.Screen name={TAB_NAVIGATION_ROOT.SETTING_ROUTE.TERM} component={Term} />
    </MainStack.Navigator>
);

const MainTabContainer = () => {
    const { t } = useTranslation();
    const ArrayTabs = [
        {
            name: TAB_NAVIGATION_ROOT.HOME_ROUTE.ROOT,
            title: t('tab.home'),
            component: HomeStack,
            icon: Images.icons.tab.home_border,
        },
        {
            name: TAB_NAVIGATION_ROOT.WATCHLIST_ROUTE.ROOT,
            title: t('tab.market'),
            component: WatchList,
            icon: Images.icons.market,
        },
        {
            name: TAB_NAVIGATION_ROOT.COURSE_ROUTE.ROOT,
            title: t('tab.course'),
            component: CourseScreen,
            icon: Images.icons.course,
        },
        {
            name: TAB_NAVIGATION_ROOT.NEWS_ROUTE.ROOT,
            title: t('tab.news'),
            component: NewsScreen,
            icon: Images.icons.news,
        },
        {
            name: TAB_NAVIGATION_ROOT.SETTING_ROUTE.ROOT,
            title: t('tab.setting'),
            component: SettingStack,
            icon: Images.icons.setting,
        },
    ];
    return (
        <MainTab.Navigator
            tabBar={(props: BottomTabBarProps) => <StyledTabBar {...props} />}
            tabBarOptions={{
                labelStyle: { fontSize: 10 },
                style: { backgroundColor: Themes.COLORS.dark, borderTopColor: Themes.COLORS.gray, borderWidth: 0.3 },
                activeTintColor: Themes.COLORS.yellow,
                inactiveTintColor: Themes.COLORS.white,
            }}
        >
            {ArrayTabs.map((item, index) => (
                <MainTab.Screen key={`${index}`} options={{ ...item }} {...item} />
            ))}
        </MainTab.Navigator>
    );
};

export default MainTabContainer;
