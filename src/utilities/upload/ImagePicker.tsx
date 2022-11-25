/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { StyleProp, View, ViewStyle, StyleSheet, ActivityIndicator } from 'react-native';

import { StyledImage, StyledTouchable } from 'components/base';
import useModal from 'components/base/modal/useModal';
import PopupModal from 'components/base/PopupModal';
import ImageUploader from './ImageUploader';

interface ImagePickerProp {
    setImage: any;
    image: any;
    children: any;
    customStyleImage?: StyleProp<ViewStyle>;
    customStyle?: StyleProp<ViewStyle>;
    isShowImage?: boolean;
}

const ImagePicker = (props: ImagePickerProp) => {
    const { image, setImage, children } = props;
    const [loading, setLoading] = useState(false);
    const modal = useModal();
    const showPopupModal = () => {
        modal.show({
            children: (
                <PopupModal
                    modal={modal}
                    onPressLeftButton={() => pickMainImage(2)}
                    onPressRightButton={() => pickMainImage(1)}
                />
            ),
            onBackdropPress: () => {
                modal.dismissAll();
            },
        });
    };
    const pickMainImage = async (index: number) => {
        modal.dismiss();
        setTimeout(async () => {
            const uri = await ImageUploader.pickImage(index, setLoading);
            setImage(uri || image);
        }, 1000);
    };

    if (props.isShowImage) {
        return (
            <View>
                <StyledTouchable customStyle={props.customStyle} onPress={showPopupModal}>
                    <View>{children}</View>
                </StyledTouchable>
            </View>
        );
    }

    return (
        <View>
            <StyledTouchable customStyle={props.customStyle} onPress={showPopupModal}>
                {image && !loading ? (
                    <StyledImage customStyle={props.customStyleImage} source={{ uri: image }} />
                ) : loading ? (
                    <View style={[props.customStyleImage, styles.loading]}>
                        <ActivityIndicator size="small" color="#000000" />
                    </View>
                ) : (
                    <View>{children}</View>
                )}
            </StyledTouchable>
        </View>
    );
};
const styles = StyleSheet.create({
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default React.memo(ImagePicker);
