/* eslint-disable consistent-return */
import i18next from 'i18next';
import { Alert } from 'react-native';
import { check, PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';
import { goBack } from 'navigation/NavigationService';
import { isIos, logger } from '../helper';

export const checkCamera = async () => {
    try {
        const checkPermission = await check(isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
        if (checkPermission === RESULTS.GRANTED) {
            return true;
        }
        if (checkPermission === RESULTS.BLOCKED) {
            showRequestPermission('camera');
            return false;
        }
        if (checkPermission === RESULTS.DENIED) {
            const permission = await request(isIos ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
            if (permission === RESULTS.GRANTED) {
                return true;
            }
        }
        return false;
    } catch (err: any) {
        logger(err);
        return false;
    }
};

export const checkPhoto = async () => {
    try {
        const checkPermission = await check(
            isIos ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        );
        if (checkPermission === RESULTS.GRANTED || checkPermission === RESULTS.LIMITED) {
            return true;
        }
        if (checkPermission === RESULTS.BLOCKED) {
            showRequestPermission('photo');
            return false;
        }
        if (checkPermission === RESULTS.DENIED) {
            const permission = await request(
                isIos ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            );
            if (permission === RESULTS.GRANTED) {
                return true;
            }
        }
        return false;
    } catch (err: any) {
        logger(err);
        return false;
    }
};

const messages: any = {
    camera: i18next.t('permissions.camera'),
    photo: i18next.t('permissions.photo'),
};

export const showRequestPermission = (type: string, isGoBack = true) => {
    Alert.alert(
        '',
        messages[type],
        [
            {
                text: i18next.t('common.cancel'),
                onPress: () => logger('Cancel Pressed'),
                style: 'default',
            },
            {
                text: i18next.t('common.setting'),
                onPress: () => {
                    if (isGoBack) {
                        goBack();
                    }
                    openSettings().catch(() => console.warn('cannot open settings'));
                },
            },
        ],
        { cancelable: false },
    );
};
