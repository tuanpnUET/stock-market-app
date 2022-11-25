/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createComment } from 'api/modules/api-app/comment';
import { RootState } from 'app-redux/rootReducer';
import Images from 'assets/images';
import metrics from 'assets/metrics';
import sizes from 'assets/sizes';
import { StyledIcon, StyledText, StyledTouchable, StyledList, StyledImage, StyledInput } from 'components/base';
import AlertMessage from 'components/base/AlertMessage';
import ConfirmModal from 'components/base/modal/ConfirmModal';
import useLoading from 'components/base/modal/useLoading';
import useModal from 'components/base/modal/useModal';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScaledSheet } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import EditNewsModal from './EditNewsModal';

const comments = require('assets/data/comments.json');

export const Comment = (props: any) => {
    const { item } = props;
    return (
        <View style={styles.commentCnt}>
            <View style={{ flexDirection: 'row' }}>
                {item?.avatarOwner !== null && item?.avatarOwner !== undefined && (
                    <Image source={{ uri: item?.avatarOwner }} style={styles.avatarCommenter} />
                )}
                {!item?.avatarOwner && <Image source={Images.icons.noAvatar} style={styles.avatarCommenter} />}
                <Text style={styles.nameCommenter}>{item?.nameOwner}</Text>
                <Text style={styles.dateComment}>{item?.createdAt?.substring(0, 10)}</Text>
                <Text style={styles.contentComment}>{item?.content}</Text>
            </View>
        </View>
    );
};

const DetailNewsModal = (props: any) => {
    const { userInfo } = useSelector((state: RootState) => state);
    const { item, modal, commentFiltered, commentList, setCommentList } = props;
    const [like, setLike] = useState<boolean>(false);
    const [hideItem, setHideItem] = useState<boolean>(false);
    const [addComment, setAddComment] = useState<string>('');
    const { t } = useTranslation();
    const [comment, setComment] = useState(commentFiltered);
    const loading = useLoading();
    const handleCreateComment = async () => {
        if (addComment) {
            const commentObj = {
                idPost: item?._id,
                avatarOwner: userInfo?.user?.avatar,
                createdAt: new Date().toUTCString(),
                nameOwner: userInfo?.user?.name,
                content: addComment,
                idOwner: userInfo?.user?._id,
            };
            try {
                loading.show();
                const res = await createComment(commentObj);
                setComment([...comment, commentObj]);
                setCommentList([...commentList, commentObj]);
                setAddComment('');
                Alert.alert(t('toastMessage.commentSuccess'));
            } catch (err: any) {
                AlertMessage(err);
            } finally {
                loading.dismiss();
            }
        } else {
            Alert.alert(t('toastMessage.nothingToComment'));
        }
    };
    const handleLike = () => {
        //
    };
    return (
        <>
            <View style={styles.newsContainer}>
                <View style={styles.headerNews}>
                    {item?.avatarOwner !== null && item?.avatarOwner !== undefined && (
                        <Image source={{ uri: item?.avatarOwner }} style={styles.avatar} />
                    )}
                    {!item?.avatarOwner && <Image source={Images.icons.noAvatar} style={styles.avatar} />}
                    <Text style={styles.nameOwner}>{item?.nameOwner}</Text>
                    <StyledTouchable onPress={() => modal?.dismiss()} customStyle={{ position: 'absolute', right: 0 }}>
                        <StyledIcon size={40} source={Images.icons.close} />
                    </StyledTouchable>
                </View>
                <Text style={styles.date}>{item?.updatedAt.slice(0, 10)}</Text>
                <ScrollView style={styles.bodyNews}>
                    <Text style={styles.title}>{item?.title}</Text>
                    <Text style={styles.content}>{item?.content}</Text>
                    {item?.image && <StyledImage source={{ uri: item?.image }} customStyle={styles.image} />}
                </ScrollView>
                <KeyboardAvoidingView>
                    <View style={styles.footer}>
                        <StyledTouchable onPress={() => setLike(!like)}>
                            <StyledIcon size={30} source={like ? Images.icons.liked : Images.icons.unlike} />
                        </StyledTouchable>
                        <StyledTouchable onPress={() => setHideItem(!hideItem)}>
                            <StyledText i18nText={'news.comment'} customStyle={styles.comment} />
                        </StyledTouchable>
                    </View>

                    <View style={styles.inputView}>
                        <StyledInput
                            value={addComment}
                            numberOfLines={1}
                            maxLength={100}
                            customStyle={styles.inputContent}
                            onChangeText={(text: string) => {
                                setAddComment(text);
                            }}
                        />
                        <StyledTouchable
                            onPress={() => handleCreateComment()}
                            customStyle={{ position: 'absolute', right: 10, margin: 5 }}
                        >
                            <StyledIcon size={30} source={Images.icons.edit_post} />
                        </StyledTouchable>
                    </View>
                </KeyboardAvoidingView>
            </View>
            {hideItem && (
                <View style={[styles.news, { paddingTop: 10, paddingBottom: 10 }]}>
                    <StyledText i18nText={'news.hideComment'} customStyle={styles.hide} />
                </View>
            )}
            {!hideItem && (
                <View style={[styles.news, comment?.length === 0 ? { height: 50 } : { flex: 0.4 }]}>
                    <StyledList
                        noDataStyle={styles.noDataStyle}
                        noDataText={t('news.noComment')}
                        data={comment}
                        renderItem={({ item, index }: any) => <Comment item={item} />}
                        keyExtractor={(item: any) => `key_${item?._id}`}
                        // initialScrollIndex={comment.length - 1}
                    />
                </View>
            )}
        </>
    );
};

const styles = ScaledSheet.create({
    newsContainer: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: 'white',
        padding: 5,
        alignSelf: 'center',
    },
    news: {
        width: '100%',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        padding: 5,
        alignSelf: 'center',
    },
    headerNews: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        // alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    nameOwner: {
        fontSize: sizes.FONTSIZE.large,
        fontWeight: 'bold',
        position: 'absolute',
        left: 45,
    },
    date: {
        fontSize: sizes.FONTSIZE.small,
        opacity: 0.5,
        left: 45,
        top: -20,
    },
    bodyNews: {
        flexDirection: 'column',
        top: -15,
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
    image: {
        width: '100%',
        height: '200@vs',
        borderRadius: 10,
    },
    footer: {
        margin: 5,
        width: metrics.screenWidth - 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    right: {
        marginRight: 0,
        padding: 5,
    },
    comment: {
        fontSize: sizes.FONTSIZE.large,
        fontWeight: 'bold',
    },
    hide: {
        fontSize: sizes.FONTSIZE.large,
        alignSelf: 'center',
        opacity: 0.5,
    },
    commentCnt: {
        paddingTop: 5,
        margin: 3,
    },
    avatarCommenter: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    nameCommenter: {
        fontSize: sizes.FONTSIZE.normal,
        fontWeight: 'bold',
        position: 'absolute',
        left: 35,
        top: -2,
    },
    contentComment: {
        fontSize: sizes.FONTSIZE.mini,
        position: 'absolute',
        right: 0,
        margin: 5,
    },
    dateComment: {
        fontSize: sizes.FONTSIZE.mini,
        opacity: 0.5,
        left: 5,
        top: -25,
    },
    noDataStyle: {
        opacity: 0.5,
        height: 50,
    },
    inputContent: {
        textAlign: 'justify',
        textAlignVertical: 'top',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        borderWidth: 0,
        paddingVertical: 0,
        maxHeight: 200,
        fontSize: '18@ms0.3',
        width: metrics.screenWidth - 55,
    },
    inputView: {
        width: metrics.screenWidth - 55,
        flexDirection: 'column',
        alignItems: 'center',
        margin: '5@vs',
        backgroundColor: '#eeeeee',
        borderRadius: 10,
    },
});

export default DetailNewsModal;
