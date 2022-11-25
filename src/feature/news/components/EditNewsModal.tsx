/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-underscore-dangle */
import { uploadImage } from 'api/modules/api-app/general';
import { updatePost } from 'api/modules/api-app/post';
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
import { View, Text, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScaledSheet } from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { checkCamera, checkPhoto, showRequestPermission } from 'utilities/permissions';
import ImageUploader from 'utilities/upload/ImageUploader';

const EditNewsModal = (props: any) => {
    console.log(props);
    const { userInfo } = useSelector((state: RootState) => state);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [content, setContent] = useState<string>(props?.content);
    const [title, setTitle] = useState<string>(props?.title);
    const [urlImage, setUrlImage] = useState(props?.image);
    const [date, setDate] = useState<string>(props?.updatedAt);
    const { t } = useTranslation();
    const loading = useLoading();
    // console.log('props', props);

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
            nameOwner: props?.nameOwner,
            idOwner: props?.idOwner,
            avatarOwner: userInfo?.user?.avatar,
            title,
            content,
            image: urlImage,
        };
        try {
            loading.show();
            const res = await updatePost(props?._id, newNews);
            props?.modal?.dismiss();
            props?.onRefresh();
            Toast.show({
                type: 'success',
                text1: t('toastMessage.updatePostSuccess'),
            });
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
                {userInfo?.user?.avatar !== null && userInfo?.user?.avatar !== undefined ? (
                    <Image source={{ uri: userInfo?.user?.avatar }} style={styles.avatar} />
                ) : (
                    <Image source={Images.icons.noAvatar} style={styles.avatar} />
                )}
                <StyledImage
                    source={userInfo?.user?.avatar ? userInfo?.user?.avatar : Images.icons.noAvatar}
                    customStyle={styles.avatar}
                />
                <Text style={styles.nameOwner}>{userInfo?.user?.name}</Text>
                <StyledTouchable
                    onPress={() => props?.modal?.dismiss()}
                    customStyle={{ position: 'absolute', right: 0 }}
                >
                    <StyledIcon size={50} source={Images.icons.close} />
                </StyledTouchable>
            </View>
            <Text style={styles.date}>{date.slice(0, 10)}</Text>
            <View style={styles.bodyNews}>
                <View style={[styles.labelInput, { flexDirection: 'row' }]}>
                    <StyledText i18nText={'addNews.title'} customStyle={styles.fontSize} />
                    <StyledText originValue={'*'} customStyle={{ color: Themes.COLORS.red }} />
                </View>
                <View style={styles.inputView}>
                    <StyledInput
                        value={title}
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
                        value={content}
                        multiline={true}
                        numberOfLines={6}
                        maxLength={1000}
                        customStyle={styles.inputContent}
                        onChangeText={(text: string) => {
                            setContent(text);
                        }}
                        blurOnSubmit={false}
                    />
                </View>
            </View>
            {urlImage && (
                <View>
                    <StyledImage source={{ uri: urlImage }} customStyle={styles.image} resizeMode={'contain'} />
                </View>
            )}

            <View style={styles.content}>
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
                            <StyledIcon source={Images.icons.ic_small_camera} size={25} customStyle={styles.camera} />
                            <StyledText customStyle={styles.feature} i18nText={'addNews.takePicture'} />
                        </StyledTouchable>
                    </View>
                    <View style={styles.imageView}>
                        <StyledTouchable onPress={onPickImage}>
                            <StyledIcon source={Images.icons.ic_small_library} size={25} customStyle={styles.camera} />
                            <StyledText customStyle={styles.feature} i18nText={'addNews.chooseFromAlbum'} />
                        </StyledTouchable>
                    </View>
                </View>
            </View>
            <View>
                <StyledButton
                    disabled={!isValid}
                    onPress={submit}
                    title={t('common.update')}
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
        paddingTop: metrics.safeTopPadding,
        alignSelf: 'center',
    },
    headerNews: {
        flexDirection: 'row',
        margin: 5,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nameOwner: {
        left: -30,
        fontSize: sizes.FONTSIZE.large,
        fontWeight: 'bold',
    },
    date: {
        fontSize: sizes.FONTSIZE.small,
        opacity: 0.5,
        left: 55,
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
        width: '30%',
        borderWidth: 1,
        borderColor: Themes.COLORS.black,
        borderRadius: '10@vs',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
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

export default EditNewsModal;
