export default function reducer(state={
    hitung: {},
    fetching: false,
    fetched: false,
    error: null
}, action){
    switch(action.type){
        case "FETCH_HITUNG": {
            return {...state, fetching: true}
        }
        case "FETCH_HITUNG_REJECTED": {
            return {...state, fetching: false, error: action.payload}
        }
        case "FETCH_HITUNG_FULFILLED": {
            return {
                ...state, 
                fetching: false,
                fetched: true,
                hitung: action.payload
            }
        }
        default: {
            return {
                ...state
            }
        }
    }
}