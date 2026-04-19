import React from 'react';
import {
    Card, Button, CardTitle,
    Col, Alert, Row,
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
            <FormGroup row className="mb-4">
                <Label for="status_wali" col="12" xl="3" className="mb-2 mb-xl-0">Status Wali</Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check><Field name="status_wali" component={InputBs} type="radio" value="ada" />{' '}Ada</Label>
                            </FormGroup>
                        </Col>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check><Field name="status_wali" component={InputBs} type="radio" value="tidak" />{' '}Tidak Ada</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            {status_wali === 'ada' && (
                <div className="animate-fade-in">
                    <FormGroup row className="mb-4">
                        <Label for="nama_wali" col="12" xl="3" className="mb-2 mb-xl-0">Nama Lengkap</Label>
                        <Col col="12" xl="9">
                            <Field name="nama_wali" component={InputBs} type="text" placeholder="Nama Lengkap" />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="alamat_wali" col="12" xl="3" className="mb-2 mb-xl-0">Alamat Lengkap</Label>
                        <Col col="12" xl="9">
                            <Field name="alamat_wali" component={InputBs} type="textarea" rows="3" placeholder="Alamat Lengkap" />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="provinsi_wali" col="12" xl="3" className="mb-2 mb-xl-0">Provinsi</Label>
                        <Col col="12" xl="9">
                            <Field name="provinsi_wali" component={InputBs} type="select"
                                onChange={handleProvinsi}>{' '}
                                <option value="" disabled={ref_kabkot_wali.length}>-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_wali) ? ref_provinsi_wali.map((data, key) =>
                                    <option value={data.provinsi_id} key={key}>{data.provinsi_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kabkot_wali" col="12" xl="3" className="mb-2 mb-xl-0">Kab/Kota</Label>
                        <Col col="12" xl="9">
                            <Field name="kabkot_wali" component={InputBs} type="select"
                                onChange={handleKabkot}>{' '}
                                <option value="" disabled={ref_kecamatan_wali.length}>-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_wali) ? ref_kabkot_wali.map((data, key) =>
                                    <option value={data.kab_id} key={key}>{data.kab_nama}</option>
                                ) : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kecamatan_wali" col="12" xl="3" className="mb-2 mb-xl-0">Kecamatan</Label>
                        <Col col="12" xl="9">
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
class DataWali extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(wali.fetchAllData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            let val = values[key];
            if (val && typeof val === 'object' && !Array.isArray(val)) {
                if (val.input || val.meta || (val.name && val.onChange)) {
                    val = '';
                }
            }
            formData.append(key, val || '');
        }
        this.props.dispatch(wali.updateData(cookies.get(cookieName), formData)).then(() => {
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error('Gagal menyimpan data wali:', err);
        });
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