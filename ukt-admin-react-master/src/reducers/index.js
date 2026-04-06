import { combineReducers } from "redux"
import { reducer as formReducer } from 'redux-form'
import { loadingAll } from 'redux-global-loader';

import cmahasiswa from "./cmahasiswa"
import captcha from "./captcha"
import hitung from "./hitung"
import user from "./user"
import ayah from "./ayah"
import ibu from "./ibu"
import info from "./info"
import admin from "./admin"
import kabkot from "./kabkot"
import kecamatan from "./kecamatan"
import kendaraan from "./kendaraan"
import listrik from "./listrik"
import provinsi from "./provinsi"
import pekerjaan from "./pekerjaan"
import pendukung from "./pendukung"
import rumah from "./rumah"
import ukt from "./ukt"
import wali from "./wali"
import dashboarddata from "./dashboarddata"
import rekapitulasi from "./rekapitulasi"

export default combineReducers({
    cmahasiswa,
    captcha,
    hitung,
    user,
    ayah,
    ibu,
    info,
    admin,
    form: formReducer,
    kabkot,
    kecamatan,
    kendaraan,
    listrik,
    provinsi,
    pekerjaan,
    pendukung,
    rumah,
    ukt,
    wali,
    dashboarddata,
    loadingAll,
    rekapitulasi,
})