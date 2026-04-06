import axios from "axios"
import { service, notif, errLog, cookies, cookieName } from "../global"

export function getByLoggedIn(token){
    return new Promise((resolve, reject) => {
        axios.get(service + "/users/getUser", {
            headers: {
                "Authorization": "Bearer "+token
            }
        })
        .then((response) => {
            resolve(response.data)
        })
        .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response),"error")
            cookies.remove(cookieName, {path: "/"})
            reject(err.response)
        })
    })
}

export function login(req){
    return new Promise(function(resolve, reject){
        axios.post(service+"/users/login", {
            no_peserta: req.no_peserta,
            password: req.password,
            kode: req.kode_captcha,
            jawaban: req.jawaban
        })
        .then((response) => {
            resolve(response.data)
        })
        .catch((err) => {
            reject(err.response)
        })
    })
}

export function saveUser(token, req){
    return new Promise((resolve, reject) => {
        req.no_peserta = req.username
        axios.post(service + "/users/add", req, {
            headers: {
                "Authorization": "Bearer "+token
            }
        })
        .then((response) => {
            resolve(response.data)
        })
        .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response),"error")
            cookies.remove(cookieName, {path: "/"})
            reject(err.response)
        })
    })
}

export function deleteById(token, username){
    return new Promise((resolve, reject) => {
        axios.delete(service + "/users/delete/"+username, {
            headers: {
                "Authorization": "Bearer "+token
            }
        })
        .then((response) => {
            resolve(response.data)
        })
        .catch((err) => {
            notif("Terjadi kesalahan!", errLog(err.response),"error")
            cookies.remove(cookieName, {path: "/"})
            reject(err.response)
        })
    })
}