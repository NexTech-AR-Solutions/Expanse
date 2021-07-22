import en from '../locale/en';
import fr from '../locale/fr';
import ja from '../locale/ja';

const languages = [
  'en',
  'fr', 
  'ja'
]

const defaultLanguage = languages[0]

export const getLocalCopy = () => {

    const param = new URLSearchParams(window.location.search).get('lang') || '';
    const language = languages.includes(param) ? param : defaultLanguage

    switch (language) {
        case 'en':
            return en;
        case 'fr':
            return fr;
        case 'ja':
            return ja;
        default:
            return en;
    }

}

export const getLocalDateFormat = () => {

    const param = new URLSearchParams(window.location.search).get('lang') || '';
    const language = languages.includes(param) ? param : defaultLanguage

    switch (language) {
        case 'fr': return "fr-FR";
        case 'ja': return "ja-JP";
        default: return "en-US";
    }
}