export const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE';
export interface languageData {
    language: string;
}

export interface ChangeLanguageAction {
    type: typeof CHANGE_LANGUAGE;
    data: languageData;
}
