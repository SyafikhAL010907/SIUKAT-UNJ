export default function reducer(state={
    captcha: {},
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
        case "FETCH_CAPTCHA": {
            return {...state, fetching: true}
        }
        case "FETCH_CAPTCHA_REJECTED": {
            return {...state, fetching: false, error: action.payload}
        }
        case "FETCH_CAPTCHA_FULFILLED": {
            return {
                ...state, 
                fetching: false,
                fetched: true,
                captcha: action.payload
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}