import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { loadingAll } from 'redux-global-loader';

import ayah from './ayah';
import captcha from './captcha';
import cmahasiswa from './cmahasiswa';
import ibu from './ibu';
import info from './info';
import kabkot from './kabkot';
import kecamatan from './kecamatan';
import kendaraan from './kendaraan';
import listrik from './listrik';
import provinsi from './provinsi';
import pendukung from './pendukung';
import pekerjaan from './pekerjaan';
import rumah from './rumah';
import ukt from './ukt';
import user from './user';
import wali from './wali';
import verifikasi from './verifikasi';
import keringanan from './keringanan';

export default combineReducers({
    ayah,
    captcha,
    cmahasiswa,
    ibu,
    info,
    kabkot,
    kecamatan,
    kendaraan,
    listrik,
    provinsi,
    pendukung,
    pekerjaan,
    rumah,
    ukt,
    user,
    wali,
    verifikasi,
    keringanan,
    form: formReducer,

    loadingAll,
});
