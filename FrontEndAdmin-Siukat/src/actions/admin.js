import { admin, user } from '../api'

export function fetchAdmin(token, pageKeyword){
    return {
        type: "FETCH_ADMIN",
        payload: admin.fetchAdmin(token, pageKeyword)
    }
}
export function getById(token, id){
    return {
        type: "FETCH_SINGLE_ADMIN",
        payload: admin.getById(token, id)
    }
}
export function emptyAdmin(){
    return {
        type: "FETCH_SINGLE_ADMIN",
        payload: new Promise((resolve, reject) => {
            resolve({
                nama_lengkap: "",
                no_telepon: "",
                role: "",
                username: ""
            })
        })
    }
}
export function save(token, input){
    return {
        type: "FETCH_ADMIN",
        payload: admin.save(token, input).then((res) => {
            return admin.fetchAdmin(token, {perPage: 10, page: 1, keyword: ""})
        })
    }
}
export function deleteById(token, username){
    return {
        type: "FETCH_ADMIN",
        payload: admin.deleteById(token, username).then((res) => {
            return admin.fetchAdmin(token, {perPage: 10, page: 1, keyword: ""})
        })
    }
}