/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, FunctionComponent } from 'react';
import { RefreshControl, TouchableOpacity, View } from 'react-native';
import { Text } from 'native-base';
import { Searchbar } from 'react-native-paper';

import { StyledIcon, StyledImage, StyledList, StyledText, StyledTouchable } from 'components/base';
import { ScaledSheet } from 'react-native-size-matters';
import metrics from 'assets/metrics';
import Images from 'assets/images';
import { useTranslation } from 'react-i18next';
import { navigate } from 'navigation/NavigationService';
import { TAB_NAVIGATION_ROOT } from 'navigation/config/routes';
import { Themes, ThemesDark } from 'assets/themes';
import sizes from 'assets/sizes';
import { removeVietnameseTones } from 'utilities/validate';
import useModal from 'components/base/modal/useModal';
import Header from 'components/base/Header';
import { getAllCategory, getAllCourse } from 'api/modules/api-app/general';
import CategoryFilter from './components/CategoryFilter';
import DetailCourseModal from './components/DetailCourseModal';

const coursesList = require('assets/data/courses.json');
const categoriesList = require('assets/data/category_courses.json');

export const Course = (props: any) => {
    const detailCourseModal = useModal();
    const { item } = props;

    const openDetailCourseModal = () => {
        detailCourseModal.show({
            children: <DetailCourseModal item={item} modal={detailCourseModal} />,
            onBackdropPress: () => {
                detailCourseModal.dismiss();
            },
        });
    };

    return (
        <TouchableOpacity style={styles.containerCourse} onPress={openDetailCourseModal}>
            {item?.urlBanner && <StyledImage source={{ uri: item?.urlBanner }} customStyle={styles.img} />}
            <View style={styles.footer}>
                <Text style={styles.title}>{item?.title}</Text>
                <Text style={styles.date}>{item?.createdAt.substring(0, 10)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const CourseScreen: FunctionComponent = () => {
    const { t } = useTranslation();
    const [courses, setCourses] = useState([]);
    const [initialState, setInitialState] = useState([]);
    const [categories, setCategories] = useState([]);
    const [active, setActive] = useState<number>(-1);
    const [txtSearch, setTxtSearch] = useState('');
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        getData();
    }, []);

    const getData = async () => {
        setRefreshing(true);
        const resCourse = await getAllCourse();
        setInitialState(resCourse);
        setCourses(resCourse);
        const resCategory = await getAllCategory();
        setCategories(resCategory);
        setRefreshing(false);
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        searchCourse(txtSearch);
        if (txtSearch === '') setCourses(initialState);
    }, [txtSearch]);

    const updateSearch = (search: string) => {
        setTxtSearch(search);
    };

    // search
    const searchCourse = (txt: string) => {
        if (txt !== '') {
            setCourses(
                courses.filter(
                    (course: any) =>
                        removeVietnameseTones(course?.title.toLowerCase()).search(
                            removeVietnameseTones(txt.toLowerCase()),
                        ) !== -1,
                ),
            );
        } else setCourses(initialState);
    };

    // set course by category
    const changeCtg = (ctg: string) => {
        if (ctg === 'All') setCourses(initialState);
        else setCourses(initialState.filter((course: any) => course?.categoryId === ctg));
    };
    return (
        <>
            <Header />
            <Searchbar
                value={txtSearch}
                inputStyle={{ backgroundColor: '#EEEEEE', marginLeft: 12, borderRadius: 25 }}
                style={styles.searchBar}
                onChangeText={updateSearch}
                icon={Images.icons.search}
                clearIcon={Images.icons.close}
                placeholder={t('common.search')}
                onIconPress={() => updateSearch}
            />
            <CategoryFilter
                categories={categories}
                categoryFilter={changeCtg}
                courses={courses}
                active={active}
                setActive={setActive}
            />
            {courses.length > 0 ? (
                <View style={{ flex: 1, position: 'relative', backgroundColor: ThemesDark.colors.base }}>
                    <StyledList
                        data={courses}
                        renderItem={({ item, index }: any) => <Course item={item} index={index} />}
                        keyExtractor={(item: any) => item?._id}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    />
                </View>
            ) : (
                <View style={{ flex: 1, backgroundColor: ThemesDark.colors.base }}>
                    <StyledText i18nText={t('courseScreen.noCourse')} customStyle={styles.noCourse} />
                </View>
            )}
        </>
    );
};

const styles = ScaledSheet.create({
    container: {
        backgroundColor: ThemesDark.colors.base,
    },
    listContainer: {
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        backgroundColor: 'gainsboro',
    },
    searchBar: {
        paddingLeft: 10,
    },
    imgBg: {
        width: metrics.screenWidth * 0.9,
    },
    noCourse: {
        fontSize: sizes.FONTSIZE.normal,
        opacity: 0.5,
        alignSelf: 'center',
        top: 20,
    },
    containerCourse: {
        height: '220@vs',
        backgroundColor: 'white',
        width: metrics.screenWidth - 10,
        borderRadius: 10,
        margin: 5,
    },
    img: {
        width: metrics.screenWidth - 10,
        height: '150@vs',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    footer: {
        height: '50@vs',
    },
    title: {
        fontSize: sizes.FONTSIZE.large,
        fontWeight: 'bold',
        margin: 3,
        left: 5,
    },
    date: {
        fontSize: sizes.FONTSIZE.normal,
        opacity: 0.5,
        top: -5,
        left: 5,
    },
});
export default CourseScreen;
