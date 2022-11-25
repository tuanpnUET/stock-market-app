/* eslint-disable import/no-unresolved */
import React, { FunctionComponent } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import metrics from 'assets/metrics';
import { BottomTabBarOptions } from '@react-navigation/bottom-tabs';
import { StyledText } from 'components/base';
import { Themes, ThemesDark } from 'assets/themes';
import Size from 'assets/sizes';
import { Descriptor, NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native';
import {
    BottomTabNavigationEventMap,
    BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs/lib/typescript/src/types';

interface NewBottomTabNavigationOptions extends BottomTabNavigationOptions {
    icon?: any;
}
type BottomTabDescriptor = Descriptor<
    ParamListBase,
    string,
    TabNavigationState<ParamListBase>,
    NewBottomTabNavigationOptions
>;
type BottomTabDescriptorMap = {
    [key: string]: BottomTabDescriptor;
};
type BottomTabBarProps<T = BottomTabBarOptions> = T & {
    state: TabNavigationState<ParamListBase>;
    descriptors: BottomTabDescriptorMap;
    navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};
const StyledTabBar: FunctionComponent<BottomTabBarProps> = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    return (
        <View style={styles.tabContainer}>
            {state.routes.map((route: any, index: any) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        activeOpacity={1}
                        accessibilityRole="button"
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        key={route.key}
                        style={[styles.tabButton]}
                    >
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                        {/* @ts-ignore */}
                        <Image
                            source={options?.icon}
                            style={[
                                styles.tabIcon,
                                {
                                    tintColor: isFocused ? Themes.COLORS.yellow : Themes.COLORS.white,
                                },
                            ]}
                        />
                        <StyledText
                            customStyle={[
                                styles.tabLabel,
                                {
                                    color: isFocused ? Themes.COLORS.yellow : Themes.COLORS.white,
                                },
                            ]}
                            i18nText={options?.title || ''}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        width: metrics.screenWidth,
        backgroundColor: ThemesDark.colors.dark,
        flexDirection: 'row',
        borderTopColor: '#DEE2E6',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: metrics.screenHeight * 0.08,
        paddingLeft: 5,
        paddingRight: 5,
        borderTopWidth: 0.5,
        borderColor: Themes.COLORS.white,
    },
    tabButton: {
        alignItems: 'center',
        width: '20%',
        height: metrics.screenHeight * 0.06,
    },
    tabIcon: {
        width: 17,
        height: 17,
        resizeMode: 'contain',
    },
    tabLabel: {
        paddingLeft: Size.PADDING.defaultTextPadding,
        textAlign: 'center',
        top: 3,
        fontSize: 10,
    },
});

export default StyledTabBar;
