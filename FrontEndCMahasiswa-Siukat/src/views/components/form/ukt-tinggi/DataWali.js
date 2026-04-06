import React from 'react';
import {
    Card, Button, CardTitle,
    Col, Alert,
    Form, FormGroup, Label
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { InputBs, AlertFormLengkap, AlertFormBelumLengkap } from '../';
import { wali, kabkot, kecamatan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName } from '../../../../global';

let FormWali = (props) => {
    const { handleSubmit,
        pristine, submitting, dispatch,
        ref_provinsi_wali, ref_kabkot_wali, ref_kecamatan_wali,
        status_wali } = props;
    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForWali(e.target.value));
        dispatch(kecamatan.fetchForWali({ type: 'FETCH_KECAMATAN_WALI_FULFILLED', payload: [] }));
    };
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForWali(e.target.value));
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="status_wali" md={3}>Status Wali</Label>
                <Col md={2}>
                    <FormGroup check>
                        <Label check><Field name="status_wali" component={InputBs} type="radio" value="ada" />{' '}Ada</Label>
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <FormGroup check>
                        <Label check><Field name="status_wali" component={InputBs} type="radio" value="tidak" />{' '}Tidak Ada</Label>
                    </FormGroup>
                </Col>
            </FormGroup>

            {status_wali === 'ada' && (
                <div>
                    <FormGroup row>
                        <Label for="nama_wali" md={3}>Nama Lengkap</Label>
                        <Col md={9}>
                            <Field name="nama_wali" component={InputBs} type="text" placeholder="Nama Lengkap" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="alamat_wali" md={3}>Alamat Lengkap</Label>
                        <Col md={9}>
                            <Field name="alamat_wali" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap" />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="provinsi_wali" md={3}>Provinsi</Label>
                        <Col md={9}>
                            <Field name="provinsi_wali" component={InputBs} type="select"
                                onChange={handleProvinsi}>{' '}
                                <option value="" disabled={ref_kabkot_wali.length}>-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_wali) ? ref_provinsi_wali.map((data, key) =>
                                    <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kabkot_wali" md={3}>Kab/Kota</Label>
                        <Col md={9}>
                            <Field name="kabkot_wali" component={InputBs} type="select"
                                onChange={handleKabkot}>{' '}
                                <option value="" disabled={ref_kecamatan_wali.length}>-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_wali) ? ref_kabkot_wali.map((data, key) =>
                                    <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="kecamatan_wali" sm={3}>Kecamatan</Label>
                        <Col sm={9}>
                            <Field name="kecamatan_wali" component={InputBs} type="select" >{' '}
                                <option value="">-- Pilih Kecamatan --</option>
                                {Array.isArray(ref_kecamatan_wali) ? ref_kecamatan_wali.map((data, key) =>
                                    <option value={data.kecam_id} key={key}>{data.kecam_nama}</option>
                                ) : ''}
                            </Field>
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
class DataWali extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(wali.fetchAllData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            formData.append(key, values[key]);
        }
        this.props.dispatch(wali.updateData(cookies.get(cookieName), formData));
        this.props.dispatch(reset('DataWali'));
        this.props.updateVerifikasi();
    }
    render() {
        return (
            <Card body>
                <CardTitle>Data Wali</CardTitle>
                <Alert color="warning"><i className="fa fa-info-circle"></i> Wali meliputi <b>Saudara, Perusahaan, Yayasan, dan Beasiswa</b></Alert>
                <FormWali
                    onSubmit={this.submitForm}
                    initialValues={this.props.wali}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormWali = reduxForm({
    form: 'DataWali',
    enableReinitialize: true,
})(FormWali);

const selector = formValueSelector('DataWali');

FormWali = connect((store) => {
    let status_wali = selector(store, 'status_wali');
    return {
        status_wali,
        ref_provinsi_wali: store.provinsi.provinsi,
        ref_kabkot_wali: store.kabkot.kabkot_wali,
        ref_kecamatan_wali: store.kecamatan.kecamatan_wali,
    };
}, {
    kabkot, kecamatan
})(FormWali);

export default connect(
    (store) => ({
        wali: store.wali.wali,
    })
)(DataWali);