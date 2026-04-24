import React from 'react';
import moment from 'moment';
// import SampleFoto from '../../../dist/img/pas_foto.jpg'
import SampleFoto from '../../../dist/img/PasPhoto.jpg';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Row,
    Alert,
    Form,
    FormGroup,
    Label,
    FormText,
} from 'reactstrap';
import { Field, reduxForm, reset } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    InputDayPicker,
    SyaratFoto,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { cmahasiswa, provinsi, kabkot, kecamatan } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, storage } from '../../../../global';

let FormDataPribadi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_provinsi,
        ref_kabkot,
        ref_kecamatan,
    } = props;
    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForCmahasiswa(e.target.value));
        dispatch(
            kecamatan.fetchForCmahasiswa({
                type: 'FETCH_KECAMATAN_MHS_FULFILLED',
                payload: [],
            })
        );
    };
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForCmahasiswa(e.target.value));
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="nama_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Nama Lengkap</Label>
                <Col col="12" xl="9">
                    <Field
                        name="nama_cmahasiswa"
                        component={InputBs}
                        type="text"
                        placeholder="Nama Lengkap"
                        disabled
                    />
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="gender_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Jenis Kelamin</Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="gender_cmahasiswa"
                                        component={InputBs}
                                        type="radio"
                                        value="laki-laki"
                                    />{' '}Laki-Laki</Label>
                            </FormGroup>
                        </Col>
                        <Col col="6" sm="4" xl="3">
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="gender_cmahasiswa"
                                        component={InputBs}
                                        type="radio"
                                        value="perempuan"
                                    />{' '}Perempuan</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label col="12" xl="3" className="mb-2 mb-xl-0">
                    Tempat &amp; Tanggal Lahir</Label>
                <Col col="12" xl="9">
                    <Row>
                        <Col col="12" md="6" className="mb-2 mb-md-0">
                            <Field
                                name="tempat_lahir_cmahasiswa"
                                component={InputBs}
                                type="text"
                                placeholder="Tempat Lahir"
                            />{' '}
                        </Col>
                        <Col col="12" md="6">
                            <Field
                                name="tanggal_lahir_cmahasiswa"
                                component={InputDayPicker}
                                startYear={1990}
                                placeholder="Tanggal Lahir"
                            />
                        </Col>
                    </Row>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="alamat_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Alamat Lengkap</Label>
                <Col col="12" xl="9">
                    <Field
                        name="alamat_cmahasiswa"
                        component={InputBs}
                        type="textarea"
                        rows="3"
                        placeholder="Alamat Lengkap"
                    />{' '}
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="provinsi_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Provinsi</Label>
                <Col col="12" xl="9">
                    <Field
                        name="provinsi_cmahasiswa"
                        component={InputBs}
                        type="select"
                        onChange={handleProvinsi}
                    >
                        {' '}
                        <option value="" disabled={ref_kabkot.length}>
                            -- Pilih Provinsi --
                        </option>
                        {Array.isArray(ref_provinsi)
                            ? ref_provinsi.map((data, key) => (
                                <option value={data.provinsi_id} key={key}>
                                    {data.provinsi_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="kabkot_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Kab/Kota</Label>
                <Col col="12" xl="9">
                    <Field
                        name="kabkot_cmahasiswa"
                        component={InputBs}
                        type="select"
                        onChange={handleKabkot}
                    >
                        {' '}
                        <option value="" disabled={ref_kecamatan.length}>
                            -- Pilih Kabupaten/Kota --
                        </option>
                        {Array.isArray(ref_kabkot)
                            ? ref_kabkot.map((data, key) => (
                                <option value={data.kab_id} key={key}>
                                    {data.kab_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="kecamatan_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Kecamatan</Label>
                <Col col="12" xl="9">
                    <Field name="kecamatan_cmahasiswa" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Kecamatan --</option>
                        {Array.isArray(ref_kecamatan)
                            ? ref_kecamatan.map((data, key) => (
                                <option value={data.kecam_id} key={key}>
                                    {data.kecam_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="telepon_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Nomor Telepon</Label>
                <Col col="12" xl="9">
                    <Field
                        name="telepon_cmahasiswa"
                        component={InputBs}
                        type="text"
                        placeholder="Nomor Telepon"
                        pattern="[0-9]{0,13}"
                        title="Hanya isi dengan angka 0-9. Maksimal 13 digit."
                    />
                    <FormText color="muted">
                        Hanya isi dengan angka. Maksimal 13 digit.
                    </FormText>
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="goldar_cmahasiswa" col="12" xl="3" className="mb-2 mb-xl-0">Golongan Darah</Label>
                <Col col="12" xl="9">
                    <Field name="goldar_cmahasiswa" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Golongan Darah --</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="AB">AB</option>
                        <option value="O">O</option>
                    </Field>
                </Col>
            </FormGroup>
            
            {/* AREA UPLOAD FOTO - REDESIGN PREMIUM */}
            <div className="p-3 mb-4 bg-light rounded-lg border-dashed">
                <Row className="align-items-center">
                    <Col md={3} xs={12} className="text-center mb-3 mb-md-0">
                        <FormText color="muted" className="d-block mb-2">Foto Saat Ini:</FormText>
                        <div style={{ maxWidth: '120px', margin: '0 auto' }}>
                            {props.initialValues.foto_cmahasiswa ? (
                                <img
                                    src={
                                        props.initialValues.foto_cmahasiswa?.startsWith('http') 
                                        ? props.initialValues.foto_cmahasiswa 
                                        : storage + '/' + props.initialValues.foto_cmahasiswa + '?t=' + new Date(props.initialValues?.updated_at || 1).getTime()
                                    }
                                    className="img-thumbnail img-responsive shadow-sm"
                                    alt="foto-cmahasiswa"
                                />
                            ) : (
                                <div className="bg-secondary text-white rounded d-flex align-items-center justify-content-center" style={{aspectRatio: '3/4'}}>
                                    <i className="fa fa-user fa-3x"></i>
                                </div>
                            )}
                        </div>
                    </Col>
                    <Col md={6} xs={12}>
                        <Label for="file_foto_cmahasiswa" className="font-weight-bold">Update Foto Baru</Label>
                        <Field
                            component={InputFileBs}
                            type="file"
                            className="form-control"
                            name="file_foto_cmahasiswa"
                            id="file_foto_cmahasiswa"
                        />
                        <div className="mt-2">
                            <SyaratFoto />
                        </div>
                    </Col>
                    <Col md={3} xs={12} className="text-center">
                        <FormText color="muted" className="d-block mb-2">Contoh Pas Foto:</FormText>
                        <div style={{ maxWidth: '120px', margin: '0 auto' }}>
                            <img
                                src={SampleFoto}
                                className="img-thumbnail img-responsive shadow-sm"
                                alt="sample-foto"
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            <FormGroup row className="mt-5 border-top pt-4">
                <Col md={{ size: 8 }} xs="12" className="mb-3 mb-md-0">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 4 }} xs="12">
                    <Button
                        type="submit"
                        className="modern-btn-primary w-100 py-3 font-weight-bold"
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save mr-2"></i> Simpan Data
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class DataPribadi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(provinsi.fetchProvinsi());
        this.props.dispatch(cmahasiswa.fetchAllData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            if (key === 'file_foto_cmahasiswa') {
                if (values[key] && values[key][0]) {
                    formData.append(key, values[key][0]);
                    document.getElementById('file_foto_cmahasiswa').value = null;
                }
            } else {
                let val = values[key];
                if (val instanceof Date || moment.isMoment(val)) {
                    val = moment(val).format('YYYY-MM-DD');
                } else if (val && typeof val === 'object' && !Array.isArray(val)) {
                    if (val.input || val.meta || (val.name && val.onChange)) {
                        val = '';
                    } else {
                        val = val.kode || val.id || val.provinsi_id || val.kab_id || val.kecam_id || '';
                    }
                }
                formData.append(key, val || '');
            }
        }
        this.props.dispatch(
            cmahasiswa.updateData(cookies.get(cookieName), formData)
        ).then(() => {
            if (this.props.updateVerifikasi) {
                this.props.updateVerifikasi();
            }
        }).catch(err => {
            console.error('Gagal menyimpan data pribadi:', err);
        });
    }
    render() {
        return (
            <Card body>
                <CardTitle>Data Diri</CardTitle>
                <Alert color="warning">
                    <i className="fa fa-info-circle"></i> Seluruh kolom pada Data Pribadi{' '}
                    <b>Wajib Diisi</b>
                </Alert>
                <FormDataPribadi
                    onSubmit={this.submitForm}
                    initialValues={this.props.cmahasiswa}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormDataPribadi = reduxForm({
    form: 'DataPribadi',
    enableReinitialize: true,
})(FormDataPribadi);

FormDataPribadi = connect(
    (store) => ({
        ref_provinsi: store.provinsi.provinsi,
        ref_kabkot: store.kabkot.kabkot_cmahasiswa,
        ref_kecamatan: store.kecamatan.kecamatan_cmahasiswa,
    }),
    {
        kabkot,
        kecamatan,
    }
)(FormDataPribadi);

export default connect((store) => {
    return {
        cmahasiswa: store.cmahasiswa.cmahasiswa,
    };
})(DataPribadi);
