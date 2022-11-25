/* eslint-disable no-underscore-dangle */
import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { ListItem, Badge, Text } from 'native-base';
import { StyledText, StyledTouchable } from 'components/base';
import { useTranslation } from 'react-i18next';
import { Themes, ThemesDark } from 'assets/themes';

const CategoryFilter = (props: any) => {
    const { t } = useTranslation();
    const { active, categories, categoryFilter, setActive } = props;
    return (
        <View style={{ height: 60, backgroundColor: ThemesDark.colors.base }}>
            <ScrollView horizontal={true}>
                <ListItem style={{ margin: 0, padding: 0, borderRadius: 0, marginLeft: 0 }}>
                    <StyledTouchable
                        key={1}
                        onPress={() => {
                            categoryFilter('All');
                            setActive(-1);
                        }}
                    >
                        <Badge
                            style={[
                                styles.center,
                                { margin: 5, paddingRight: 10, paddingLeft: 10 },
                                active === -1 ? styles.active : styles.inactive,
                            ]}
                        >
                            <StyledText
                                customStyle={{ color: 'black', fontWeight: 'bold' }}
                                i18nText={t('courseScreen.all')}
                            />
                        </Badge>
                    </StyledTouchable>
                    {categories.map((item: any) => (
                        <StyledTouchable
                            key={item._id}
                            onPress={() => {
                                categoryFilter(item._id);
                                setActive(categories.indexOf(item));
                            }}
                        >
                            <Badge
                                style={[
                                    styles.center,
                                    { margin: 5 },
                                    active === categories.indexOf(item) ? styles.active : styles.inactive,
                                ]}
                            >
                                <Text style={{ color: 'black', fontWeight: 'bold' }}>{item.category}</Text>
                            </Badge>
                        </StyledTouchable>
                    ))}
                </ListItem>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    active: {
        backgroundColor: Themes.COLORS.darkOrange,
    },
    inactive: {
        backgroundColor: Themes.COLORS.cornSilk,
    },
});

export default CategoryFilter;
