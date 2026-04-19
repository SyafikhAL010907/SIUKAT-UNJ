import React from 'react';
import moment from 'moment';
import {
    Card, Button, CardTitle,
    Col, Alert, Row,
    Form, FormGroup, Label, FormText
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { InputBs, InputDayPicker, AlertFormLengkap, AlertFormBelumLengkap } from '../';
import { ayah, kabkot, kecamatan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName } from '../../../../global';

let FormAyah = (props) => {
    const { handleSubmit,
        pristine, submitting, dispatch,
        ref_provinsi_ayah, ref_kabkot_ayah, ref_kecamatan_ayah,
        status_ayah } = props;

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForAyah(e.target.value));
        dispatch(kecamatan.fetchForAyah({ type: 'FETCH_KECAMATAN_AYAH_FULFILLED', payload: [] }));
    };
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForAyah(e.target.value));
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="nama_ayah" col="12" xl="3" className="mb-2 mb-xl-0">Nama Lengkap</Label>
                <Col col="12" xl="9">
                    <Field name="nama_ayah" component={InputBs} type="text" placeholder="Nama Lengkap" />
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="status_ayah" col="12" xl="3" className="mb-2 mb-xl-0">Status Ayah</Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="status_ayah"
                                        component={InputBs}
                                        type="radio"
                                        value="hidup"
                                    />{' '}Hidup</Label>
                            </FormGroup>
                        </Col>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="status_ayah"
                                        component={InputBs}
                                        type="radio"
                                        value="wafat"
                                    />{' '}Wafat</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            {status_ayah === 'hidup' && (
                <div className="animate-fade-in">
                    <FormGroup row className="mb-4">
                        <Label col="12" xl="3" className="mb-2 mb-xl-0">Tempat &amp; Tanggal Lahir</Label>
                        <Col col="12" xl="9">
                            <Row>
                                <Col col="12" md="6" className="mb-2 mb-md-0">
                                    <Field name="tempat_lahir_ayah" component={InputBs} type="text" placeholder="Tempat Lahir" />{' '}
                                </Col>
                                <Col col="12" md="6">
                                    <Field name="tanggal_lahir_ayah" component={InputDayPicker} startYear={1950} placeholder="Tanggal Lahir" />
                                </Col>
                            </Row>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="alamat_ayah" col="12" xl="3" className="mb-2 mb-xl-0">Alamat Lengkap</Label>
                        <Col col="12" xl="9">
                            <Field name="alamat_ayah" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap" />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="provinsi_ayah" col="12" xl="3" className="mb-2 mb-xl-0">Provinsi</Label>
                        <Col col="12" xl="9">
                            <Field name="provinsi_ayah" component={InputBs} type="select"
                                onChange={handleProvinsi}>{' '}
                                <option value="" disabled={ref_kabkot_ayah.length}>-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_ayah) ? ref_provinsi_ayah.map((data, key) =>
                                    <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kabkot_ayah" col="12" xl="3" className="mb-2 mb-xl-0">Kab/Kota</Label>
                        <Col col="12" xl="9">
                            <Field name="kabkot_ayah" component={InputBs} type="select"

                                onChange={handleKabkot}>{' '}
                                <option value="" disabled={ref_kecamatan_ayah.length}>-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_ayah) ? ref_kabkot_ayah.map((data, key) =>
                                    <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kecamatan_ayah" col="12" xl="3" className="mb-2 mb-xl-0">Kecamatan</Label>
                        <Col col="12" xl="9">
                            <Field name="kecamatan_ayah" component={InputBs} type="select" >{' '}
                                <option value="">-- Pilih Kecamatan --</option>
                                {Array.isArray(ref_kecamatan_ayah) ? ref_kecamatan_ayah.map((data, key) =>
                                    <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="telepon_ayah" col="12" xl="3" className="mb-2 mb-xl-0">Nomor Telepon</Label>
                        <Col col="12" xl="9">
                            <Field name="telepon_ayah" component={InputBs} type="text" placeholder="Nomor Telepon" pattern="[0-9]{0,13}" title="Hanya isi dengan angka 0-9. Maksimal 13 digit." />
                            <FormText color="muted">
                                Hanya isi dengan angka. Maksimal 13 digit.
                            </FormText>
                        </Col>
                    </FormGroup>
                </div>
            )}

            <FormGroup row className="mt-5 border-top pt-4">
                <Col md={{ size: 8 }} xs="12" className="mb-3 mb-md-0">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 4 }} xs="12">
                    <Button type="submit" className="modern-btn-primary w-100 py-3 font-weight-bold" disabled={pristine || submitting}><i className="fa fa-save mr-2"></i> Simpan Data</Button>
                </Col>
            </FormGroup>
        </Form>
    );
};

class DataAyah extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ayah.fetchAllData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            if (key.startsWith('file_scan')) {
                if (values[key] && values[key].length > 0) {
                    formData.append(key, values[key][0]);
                    const el = document.getElementById(key);
                    if (el) el.value = null;
                }
            } else {
                let val = values[key];
                if (val instanceof Date || moment.isMoment(val)) {
                    val = moment(val).format('YYYY-MM-DD');
                } else if (val && typeof val === 'object' && !Array.isArray(val)) {
                    if (val.input || val.meta || (val.name && val.onChange)) {
                        val = '';
                    }
                }
                formData.append(key, val || '');
            }
        }
        this.props.dispatch(ayah.updateData(cookies.get(cookieName), formData)).then(() => {
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error('Gagal menyimpan data ayah:', err);
        });
    }
    render() {
        return (
            <Card body>
                <CardTitle>Data Ayah</CardTitle>
                <Alert color="warning"><i className="fa fa-info-circle"></i> Seluruh kolom pada Data Ayah <b>Wajib Diisi</b></Alert>
                <FormAyah
                    onSubmit={this.submitForm}
                    initialValues={this.props.ayah}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormAyah = reduxForm({
    form: 'DataAyah',
    enableReinitialize: true,
})(FormAyah);

const selector = formValueSelector('DataAyah');

FormAyah = connect((store) => {
    let status_ayah = selector(store, 'status_ayah');
    return {
        status_ayah,

        ref_provinsi_ayah: store.provinsi.provinsi,
        ref_kabkot_ayah: store.kabkot.kabkot_ayah,
        ref_kecamatan_ayah: store.kecamatan.kecamatan_ayah,
    };
}, {
    kabkot, kecamatan
})(FormAyah);

export default connect(
    (store) => ({
        ayah: store.ayah.ayah,
    })
)(DataAyah);