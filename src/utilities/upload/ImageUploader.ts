/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */
import { uploadImage } from 'api/modules/api-app/general';
import ImagePicker from 'react-native-image-crop-picker';
import { logger } from 'utilities/helper';
import { checkCamera, checkPhoto } from 'utilities/permissions';

const MAX_WIDTH = 800;
const MAX_HEIGHT = 800;
enum takePhoto {
    fromGallery = 1,
    fromCamera = 2,
}
const ImageUploaded = {
    pickImage: async (index: number, setLoading: any) => {
        try {
            let localPath: any = '';
            if (index === takePhoto.fromGallery) {
                const permission = await checkPhoto();
                if (permission) {
                    localPath = await ImageUploaded.chooseImageFromGallery();
                }
            } else if (index === takePhoto.fromCamera) {
                const permission = await checkCamera();
                if (permission) {
                    localPath = await ImageUploaded.chooseImageFromCamera();
                }
            }
            let uri: any = '';
            if (localPath) {
                setLoading(true);
                uri = await ImageUploaded.uploader(localPath);
                // console.log('uri', uri);
            }
            return uri;
        } catch (error: any) {
            logger(error);
            return null;
        } finally {
            setLoading(false);
        }
    },

    pickImageFromGallery: async () => {
        try {
            await checkPhoto();
            const localPath = await ImageUploaded.chooseImageFromGallery(false);
            return localPath;
        } catch (err: any) {
            logger(err);
            return null;
        }
    },

    chooseImageFromCamera: () =>
        ImagePicker.openCamera({
            width: MAX_WIDTH,
            height: MAX_HEIGHT,
            compressImageMaxWidth: MAX_WIDTH,
            compressImageMaxHeight: MAX_HEIGHT,
            compressImageQuality: 1,
            waitAnimationEnd: true,
            // includeBase64: true,
            // forceJpg: true,
            mediaType: 'photo',
            cropping: false,
        }),

    chooseImageFromGallery: (cropping = true) =>
        ImagePicker.openPicker({
            width: MAX_WIDTH,
            height: MAX_HEIGHT,
            compressImageMaxWidth: MAX_WIDTH,
            compressImageMaxHeight: MAX_HEIGHT,
            // compressImageQuality: 100,
            waitAnimationEnd: true,
            compressImageQuality: 1,
            mediaType: 'photo',
            // includeBase64: true,
            // forceJpg: true,
            cropping,
        }),

    uploader: async (localPath: any) => {
        const timeStamp = new Date().getTime();
        const formatImage: any = {
            uri: localPath.path,
            name: `${timeStamp}.${'image/jpeg'}`,
            type: 'image/jpeg',
        };
        const formData: any = new FormData();
        await formData.append('files', formatImage);
        const uri = await uploadImage(formData);
        if (uri?.data?.path) {
            return uri?.data?.path;
        }
        return null;
    },
};
export default ImageUploaded;
