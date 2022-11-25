/* eslint-disable import/prefer-default-export */
import { ChangeLanguageAction, CHANGE_LANGUAGE, languageData } from './types';

export const changeLanguage = (data: languageData): ChangeLanguageAction => {
    return {
        type: CHANGE_LANGUAGE,
        data,
    };
};
