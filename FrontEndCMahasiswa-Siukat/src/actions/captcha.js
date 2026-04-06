import { captcha } from '../api';

export function fetchCaptcha(){
    return {
        type: 'FETCH_CAPTCHA',
        payload: captcha.fetchCaptcha()
    };
}