import React from 'react';
import {
    Card, Button, CardTitle,
    Col, Alert,
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
            <FormGroup row>
                <Label for="nama_ayah" md={3}>Nama Lengkap</Label>
                <Col md={9}>
                    <Field name="nama_ayah" component={InputBs} type="text" placeholder="Nama Lengkap" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="status_ayah" md={3}></Label>
                <Col md={4}>
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
                <Col md={5}>
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
            </FormGroup>

            {status_ayah === 'hidup' && (
                <div>
                    <FormGroup row>
                        <Label md={3} xs={12}>Tempat {'&'} <br />Tanggal Lahir</Label>
                        <Col md={5}>
                            <Field name="tempat_lahir_ayah" component={InputBs} type="text" placeholder="Tempat Lahir" />{' '}
                        </Col>
                        <Col md={4} xs={12}>
                            <Field name="tanggal_lahir_ayah" component={InputDayPicker} startYear={1950} placeholder="Tanggal Lahir" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="alamat_ayah" md={3}>Alamat Lengkap</Label>
                        <Col md={9}>
                            <Field name="alamat_ayah" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap" />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="provinsi_ayah" md={3}>Provinsi</Label>
                        <Col md={9}>
                            <Field name="provinsi_ayah" component={InputBs} type="select"
                                onChange={handleProvinsi}>{' '}
                                <option value="" disabled={ref_kabkot_ayah.length}>-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_ayah) ? ref_provinsi_ayah.map((data, key) =>
                                    <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kabkot_ayah" md={3}>Kab/Kota</Label>
                        <Col md={9}>
                            <Field name="kabkot_ayah" component={InputBs} type="select"

                                onChange={handleKabkot}>{' '}
                                <option value="" disabled={ref_kecamatan_ayah.length}>-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_ayah) ? ref_kabkot_ayah.map((data, key) =>
                                    <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kecamatan_ayah" sm={3}>Kecamatan</Label>
                        <Col sm={9}>
                            <Field name="kecamatan_ayah" component={InputBs} type="select" >{' '}
                                <option value="">-- Pilih Kecamatan --</option>
                                {Array.isArray(ref_kecamatan_ayah) ? ref_kecamatan_ayah.map((data, key) =>
                                    <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="telepon_ayah" md={3}>Nomor Telepon</Label>
                        <Col md={9}>
                            <Field name="telepon_ayah" component={InputBs} type="text" placeholder="Nomor Telepon" pattern="[0-9]{0,13}" title="Hanya isi dengan angka 0-9. Maksimal 13 digit." />
                            <FormText color="muted">
                                Hanya isi dengan angka. Maksimal 13 digit.
                            </FormText>
                        </Col>
                    </FormGroup>
                </div>
            )}

            <FormGroup row>
                <Col md={{ size: 9 }}>
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 3 }}>
                    <Button type="submit" color="success" block disabled={pristine || submitting}><i className="fa fa-save"></i> Simpan</Button>
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
            formData.append(key, values[key]);
        }
        this.props.dispatch(ayah.updateData(cookies.get(cookieName), formData));
        this.props.dispatch(reset('DataAyah'));
        this.props.updateVerifikasi();
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