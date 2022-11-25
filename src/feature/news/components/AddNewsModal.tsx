/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { uploadImage } from 'api/modules/api-app/general';
import { createPost } from 'api/modules/api-app/post';
import { RootState } from 'app-redux/rootReducer';
import Images from 'assets/images';
import metrics from 'assets/metrics';
import sizes from 'assets/sizes';
import { Themes } from 'assets/themes';
import { StyledButton, StyledIcon, StyledImage, StyledInput, StyledText, StyledTouchable } from 'components/base';
import AlertMessage from 'components/base/AlertMessage';
import useLoading from 'components/base/modal/useLoading';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScaledSheet } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { checkCamera, checkPhoto, showRequestPermission } from 'utilities/permissions';
import ImageUploader from 'utilities/upload/ImageUploader';

const noAvt = 'https://i.pinimg.com/originals/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.png';
const AddNewsModal = (props: any) => {
    const { userInfo } = useSelector((state: RootState) => state);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [content, setContent] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [urlImage, setUrlImage] = useState();
    const [date, setDate] = useState(new Date().toUTCString());
    const { t } = useTranslation();
    const loading = useLoading();

    useEffect(() => {
        if (urlImage) {
            setUrlImage(urlImage);
        }
    }, [urlImage]);
    useEffect(() => {
        if (content && title) setIsValid(true);
    }, [content, title]);

    const submit = async () => {
        const newNews = {
            nameOwner: userInfo?.user?.name,
            idOwner: userInfo?.user?._id,
            avatarOwner: userInfo?.user?.avatar,
            updatedAt: date,
            createdAt: date,
            title,
            content,
            image: urlImage,
        };
        try {
            loading.show();
            const res = await createPost(newNews);
            props.setNewsList([...props?.newsList, res]);
            props?.onRefresh();
            Toast.show({
                type: 'success',
                text1: t('toastMessage.addPostSuccess'),
            });
            props?.modal?.dismiss();
        } catch (err: any) {
            AlertMessage(err);
        } finally {
            loading.dismiss();
        }
    };

    const onPickImage = async () => {
        const permission = await checkPhoto();
        if (permission) {
            let image: any = '';
            image = await ImageUploader.pickImageFromGallery();
            if (image?.path) {
                const timeStamp = new Date().getTime();
                const formatImage: any = {
                    uri: image?.path,
                    name: `${timeStamp}.${'image/jpeg'}`,
                    type: 'image/jpeg',
                };
                const formData = new FormData();
                formData.append('files', formatImage);
                const temp1 = uploadImage(formData);
                const newUrlImage = await temp1;
                setUrlImage(newUrlImage?.data[0]);
            }
        } else {
            props?.modal?.dismiss();
            showRequestPermission('photo');
        }
    };
    const takePicture = async () => {
        const permission = await checkCamera();
        if (permission) {
            let image: any = '';
            image = await ImageUploader.chooseImageFromCamera();
            if (image?.path) {
                const timeStamp = new Date().getTime();
                const formatImage: any = {
                    uri: image?.path,
                    name: `${timeStamp}.${'image/jpeg'}`,
                    type: 'image/jpeg',
                };
                const formData = new FormData();
                formData.append('files', formatImage);
                const temp1 = uploadImage(formData);
                const newUrlImage = await temp1;
                setUrlImage(newUrlImage?.data[0]);
            }
        } else {
            props?.modal?.dismiss();
            showRequestPermission('camera');
        }
    };
    return (
        <KeyboardAwareScrollView style={styles.news}>
            <View style={styles.headerNews}>
                <StyledImage source={{ uri: userInfo?.user?.avatar || noAvt }} customStyle={styles.avatar} />
                <Text style={styles.nameOwner}>{userInfo?.user?.name}</Text>
                <StyledTouchable
                    onPress={() => props?.modal?.dismiss()}
                    customStyle={{ position: 'absolute', right: 0, paddingTop: metrics.safeTopPadding }}
                >
                    <StyledIcon size={50} source={Images.icons.close} />
                </StyledTouchable>
            </View>
            <Text style={styles.date}>{date}</Text>
            <View style={styles.bodyNews}>
                <View style={[styles.labelInput, { flexDirection: 'row' }]}>
                    <StyledText i18nText={'addNews.title'} customStyle={styles.fontSize} />
                    <StyledText originValue={'*'} customStyle={{ color: Themes.COLORS.red }} />
                </View>
                <View style={styles.inputView}>
                    <StyledInput
                        multiline={true}
                        numberOfLines={2}
                        maxLength={100}
                        customStyle={styles.inputContent}
                        onChangeText={(text: string) => {
                            setTitle(text);
                        }}
                    />
                </View>
                <View style={[styles.labelInput, { flexDirection: 'row' }]}>
                    <StyledText i18nText={'addNews.content'} customStyle={styles.fontSize} />
                    <StyledText originValue={'*'} customStyle={{ color: Themes.COLORS.red }} />
                </View>
                <View style={styles.inputView}>
                    <StyledInput
                        multiline={true}
                        numberOfLines={30}
                        maxLength={1000}
                        customStyle={[styles.inputContent, { height: 300 }]}
                        onChangeText={(text: string) => {
                            setContent(text);
                        }}
                        blurOnSubmit={false}
                    />
                </View>
            </View>
            {!urlImage && (
                <View style={styles.content}>
                    <StyledText customStyle={styles.header} i18nText={'addNews.takePictureHeader'} />
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '80%',
                            alignSelf: 'center',
                            marginBottom: 10,
                        }}
                    >
                        <View style={styles.imageView}>
                            <StyledTouchable onPress={takePicture}>
                                <StyledIcon
                                    source={Images.icons.ic_small_camera}
                                    size={25}
                                    customStyle={styles.camera}
                                />
                                <StyledText customStyle={styles.feature} i18nText={'addNews.takePicture'} />
                            </StyledTouchable>
                        </View>
                        <View style={styles.imageView}>
                            <StyledTouchable onPress={onPickImage}>
                                <StyledIcon
                                    source={Images.icons.ic_small_library}
                                    size={25}
                                    customStyle={styles.camera}
                                />
                                <StyledText customStyle={styles.feature} i18nText={'addNews.chooseFromAlbum'} />
                            </StyledTouchable>
                        </View>
                    </View>
                </View>
            )}
            {urlImage && (
                <View>
                    <StyledImage source={{ uri: urlImage }} customStyle={styles.image} resizeMode={'contain'} />
                </View>
            )}

            <View>
                <StyledButton
                    disabled={!isValid}
                    onPress={submit}
                    title={t('addNews.upload')}
                    customStyle={[styles.button, !isValid && { backgroundColor: Themes.COLORS.gray }]}
                    customTextColor={styles.textBtn}
                />
            </View>
        </KeyboardAwareScrollView>
    );
};
const styles = ScaledSheet.create({
    news: {
        width: metrics.screenWidth - 20,
        borderRadius: 5,
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    headerNews: {
        flexDirection: 'row',
        // alignItems: 'center',
        paddingTop: metrics.safeTopPadding,
        margin: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nameOwner: {
        fontSize: sizes.FONTSIZE.large,
        fontWeight: 'bold',
        left: 5,
    },
    date: {
        fontSize: sizes.FONTSIZE.small,
        opacity: 0.5,
        left: 45,
        top: -20,
    },
    bodyNews: {
        flexDirection: 'column',
        margin: 5,
    },
    title: {
        fontSize: sizes.FONTSIZE.normal,
        fontWeight: 'bold',
        margin: 5,
    },
    content: {
        fontSize: sizes.FONTSIZE.normal,
        margin: 5,
    },
    feature: {
        textAlign: 'center',
        fontSize: '16@ms0.3',
    },
    button: {
        width: '100@s',
        alignSelf: 'center',
        marginTop: '20@s',
        marginBottom: '20@s',
        fontSize: '20@ms0.3',
        backgroundColor: Themes.COLORS.baseOrange,
    },
    camera: {
        alignSelf: 'center',
    },
    imageView: {
        marginTop: '5@vs',
        height: '60@vs',
        width: '40%',
        borderWidth: 1,
        borderColor: Themes.COLORS.black,
        borderRadius: '10@vs',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        // backgroundColor: Themes.COLORS.baseOrange,
    },
    header: {
        textAlign: 'center',
        paddingVertical: '10@vs',
        fontSize: '20@ms0.3',
    },
    inputTitle: {
        margin: 0,
        borderWidth: 0,
        paddingVertical: 0,
        borderColor: Themes.COLORS.black,
        borderRadius: 5,
        fontSize: '18@ms0.3',
    },
    inputContent: {
        textAlign: 'justify',
        textAlignVertical: 'top',
        justifyContent: 'center',
        alignSelf: 'center',
        width: metrics.screenWidth - 30,
        margin: 3,
        borderWidth: 0,
        paddingVertical: 0,
        maxHeight: 200,
        fontSize: '18@ms0.3',
    },
    labelInput: {
        width: metrics.screenWidth - 20,
        fontSize: '18@ms0.3',
        left: 5,
    },
    inputView: {
        width: metrics.screenWidth - 40,
        flexDirection: 'column',
        alignItems: 'center',
        margin: '5@vs',
        backgroundColor: '#eeeeee',
        borderRadius: 5,
    },
    fontSize: {
        fontSize: '18@ms0.3',
        marginRight: 2,
    },
    input: {
        // width: Metrics.screenWidth * 0.7,
        margin: 0,
        borderWidth: 0,
        paddingVertical: 0,
        borderColor: Themes.COLORS.black,
        borderRadius: 5,
        fontSize: '18@ms0.3',
    },
    image: {
        width: metrics.screenWidth - 40,
        height: '200@vs',
        borderRadius: 10,
        alignSelf: 'center',
    },
    textBtn: {
        color: Themes.COLORS.white,
        fontWeight: '800',
    },
});

export default AddNewsModal;
