import React from 'react';
import {
    Card, Button, CardTitle,
    Col, Alert,
    Form, FormGroup, Label, FormText
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { InputBs, InputDayPicker, AlertFormLengkap, AlertFormBelumLengkap } from '../';
import { ibu, kabkot, kecamatan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName } from '../../../../global';

let FormIbu = (props) => {
    const { handleSubmit,
        pristine, submitting, dispatch,
        ref_provinsi_ibu, ref_kabkot_ibu, ref_kecamatan_ibu,
        status_ibu } = props;

    const handleProvinsi = (e) => {
        const val = e.target.value;
        dispatch(kabkot.fetchForIbu(val));
        dispatch({ type: 'FETCH_KECAMATAN_IBU_FULFILLED', payload: [] });
    };

    const handleKabkot = (e) => {
        const val = e.target.value;
        dispatch(kecamatan.fetchForIbu(val));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="nama_ibu" md={3}>Nama Lengkap</Label>
                <Col md={9}>
                    <Field name="nama_ibu" component={InputBs} type="text" placeholder="Nama Lengkap" />
                </Col>
            </FormGroup>
            
            <FormGroup row>
                <Label for="status_ibu" md={3}>Status Ibu</Label>
                <Col md={4}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                name="status_ibu"
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
                                name="status_ibu"
                                component={InputBs}
                                type="radio"
                                value="wafat"
                            />{' '}Wafat</Label>
                    </FormGroup>
                </Col>
            </FormGroup>

            {/* Field Tanggal Lahir dipisah agar tetap tersimpan meskipun status wafat (jika dibutuhkan sistem) */}
            <FormGroup row>
                <Label md={3} xs={12}>Tempat {'&'} <br />Tanggal Lahir</Label>
                <Col md={5}>
                    <Field name="tempat_lahir_ibu" component={InputBs} type="text" placeholder="Tempat Lahir" />
                </Col>
                <Col md={4} xs={12}>
                    {/* Pastikan name field sesuai dengan yang diharapkan API */}
                    <Field name="tanggal_lahir_ibu" component={InputDayPicker} startYear={1950} placeholder="Tanggal Lahir" />
                </Col>
            </FormGroup>

            <FormGroup row>
                <Label for="pekerjaan_ibu" md={3}>Pekerjaan</Label>
                <Col md={9}>
                    <Field name="pekerjaan_ibu" component={InputBs} type="text" placeholder="Pekerjaan Ibu" />
                </Col>
            </FormGroup>

            {status_ibu === 'hidup' && (
                <div>
                    <FormGroup row>
                        <Label for="alamat_ibu" md={3}>Alamat Lengkap</Label>
                        <Col md={9}>
                            <Field name="alamat_ibu" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="provinsi_ibu" md={3}>Provinsi</Label>
                        <Col md={9}>
                            <Field name="provinsi_ibu" component={InputBs} type="select"
                                onChange={handleProvinsi}>
                                <option value="">-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_ibu) ? ref_provinsi_ibu.map((data, key) =>
                                    <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kabkot_ibu" md={3}>Kab/Kota</Label>
                        <Col md={9}>
                            <Field name="kabkot_ibu" component={InputBs} type="select"
                                onChange={handleKabkot}>
                                <option value="">-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_ibu) ? ref_kabkot_ibu.map((data, key) =>
                                    <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kecamatan_ibu" sm={3}>Kecamatan</Label>
                        <Col sm={9}>
                            <Field name="kecamatan_ibu" component={InputBs} type="select" >
                                <option value="">-- Pilih Kecamatan --</option>
                                {Array.isArray(ref_kecamatan_ibu) ? ref_kecamatan_ibu.map((data, key) =>
                                    <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="telepon_ibu" md={3}>Nomor Telepon</Label>
                        <Col md={9}>
                            <Field name="telepon_ibu" component={InputBs} type="text" placeholder="Nomor Telepon" pattern="[0-9]{0,13}" title="Hanya isi dengan angka 0-9. Maksimal 13 digit." />
                            <FormText color="muted">
                                Hanya isi dengan angka. Maksimal 13 digit.
                            </FormText>
                        </Col>
                    </FormGroup>
                </div>
            )}

            <FormGroup row className="mt-4">
                <Col md={{ size: 9 }}>
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 3 }}>
                    <Button type="submit" color="success" block disabled={submitting}>
                        <i className="fa fa-save"></i> {submitting ? ' Menyimpan...' : ' Simpan'}
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};

class DataIbu extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ibu.fetchAllData(cookies.get(cookieName)));
    }

    submitForm = (values) => {
        const formData = new FormData();
        
        // Logika: Jika wafat, hapus data alamat/telepon agar tidak konflik di database backend
        const submissionValues = values.status_ibu === 'wafat' 
            ? { ...values, alamat_ibu: '-', telepon_ibu: '-', provinsi_ibu: '', kabkot_ibu: '', kecamatan_ibu: '' }
            : values;

        Object.keys(submissionValues).forEach(key => {
            if (submissionValues[key] !== null && submissionValues[key] !== undefined) {
                formData.append(key, submissionValues[key]);
            }
        });

        this.props.dispatch(ibu.updateData(cookies.get(cookieName), formData))
            .then(() => {
                this.props.updateVerifikasi();
                // Opsional: fetch ulang untuk memastikan data store paling baru
                this.props.dispatch(ibu.fetchAllData(cookies.get(cookieName)));
            })
            .catch((err) => {
                console.error("Gagal menyimpan data ibu", err);
            });
    }

    render() {
        return (
            <Card body>
                <CardTitle tag="h5">Data Ibu</CardTitle>
                <Alert color="warning">
                    <i className="fa fa-info-circle"></i> Seluruh kolom pada Data Ibu <b>Wajib Diisi</b>
                </Alert>
                <FormIbu
                    onSubmit={this.submitForm}
                    initialValues={this.props.ibu_data}
                    allow={this.props.allow}
                    dispatch={this.props.dispatch}
                />
            </Card>
        );
    }
}

FormIbu = reduxForm({
    form: 'DataIbu',
    enableReinitialize: true,
    // Menghindari field yang di-unmount terhapus dari state sebelum submit
    destroyOnUnmount: false, 
    forceUnregisterOnUnmount: true, 
})(FormIbu);

const selector = formValueSelector('DataIbu');

FormIbu = connect((store) => {
    const status_ibu = selector(store, 'status_ibu');
    return {
        status_ibu,
        ref_provinsi_ibu: store.provinsi.provinsi,
        ref_kabkot_ibu: store.kabkot.kabkot_ibu,
        ref_kecamatan_ibu: store.kecamatan.kecamatan_ibu,
    };
})(FormIbu);

export default connect(
    (store) => ({
        ibu_data: store.ibu.ibu,
    })
)(DataIbu);