import { CHANGE_LANGUAGE, languageData } from './types';

const initialState: languageData = {
    language: '',
};

const languageReducer = (state = initialState, action: any): languageData => {
    switch (action.type) {
        case CHANGE_LANGUAGE:
            return {
                ...state,
                ...action.data,
            };
        default:
            return state;
    }
};

export default languageReducer;
