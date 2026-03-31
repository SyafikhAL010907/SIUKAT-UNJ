import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Alert,
    Form,
    FormGroup,
    Label,
    FormText,
} from 'reactstrap';
import { connect } from 'react-redux';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputDayPicker,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import {
    bio_cmahasiswa,
    bio_agama,
    bio_tinggal,
    bio_transportasi,
    bio_provinsi,
    bio_kabkot,
    bio_kecamatan,
} from '../../../../actions';
import { cookies, cookieName } from '../../../../global';

let FormBiodataPribadi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_agama,
        ref_tinggal,
        ref_transportasi,
        ref_provinsi,
        ref_kabkot,
        ref_kecamatan,
        terima_kps,
    } = props;
    const handleBioProvinsi = (e) => {
        dispatch(bio_kabkot.fetchForBioCmahasiswa(e.target.value));
        dispatch(
            bio_kecamatan.fetchForBioCmahasiswa({
                type: 'FETCH_BIO_KECAMATAN_MHS_FULFILLED',
                payload: [],
            })
        );
    };
    const handleBioKabkot = (e) => {
        dispatch(bio_kecamatan.fetchForBioCmahasiswa(e.target.value));
    };

    console.log({ pristine });

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="nama" md={3}>Nama Lengkap</Label>
                <Col md={9}>
                    <Field
                        name="nama"
                        component={InputBs}
                        type="text"
                        placeholder="Nama Lengkap"
                        disabled
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="jenis_kelamin" md={3}>Jenis Kelamin</Label>
                <Col md={3} xs={6}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                name="jenis_kelamin"
                                component={InputBs}
                                type="radio"
                                value="laki-laki"
                            />{' '}Laki-Laki</Label>
                    </FormGroup>
                </Col>
                <Col md={3} xs={6}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                name="jenis_kelamin"
                                component={InputBs}
                                type="radio"
                                value="perempuan"
                            />{' '}Perempuan</Label>
                    </FormGroup>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_agama" md={3}>Agama</Label>
                <Col md={9}>
                    <Field name="kode_agama" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Agama --</option>
                        {Array.isArray(ref_agama)
                            ? ref_agama.map((data, key) => (
                                <option value={data.agama_id} key={key}>
                                    {data.agama_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>
                    Tempat &amp; <br />Tanggal Lahir</Label>
                <Col md={5}>
                    <Field
                        name="tempat_lahir_cmahasiswa"
                        component={InputBs}
                        type="text"
                        placeholder="Tempat Lahir"
                    />{' '}
                </Col>
                <Col md={4} xs={12}>
                    <Field
                        name="tanggal_lahir_cmahasiswa"
                        component={InputDayPicker}
                        startYear={1990}
                        placeholder="Tanggal Lahir"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kewarganegaraan" md={3}>Kewarganegaraan</Label>
                <Col md={9}>
                    <Field name="kewarganegaraan" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Kewarganegaraan --</option>
                        <option value="WNI">WNI</option>
                        <option value="WNA">WNA</option>
                        {/* {Array.isArray(ref_provinsi)
              ? ref_provinsi.map((data, key) => (
                  <option value={data.provinsi_id} key={key}>
                    {data.provinsi_nama}
                  </option>
                ))
              : ""} */}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_tinggal" md={3}>Jenis Tempat Tinggal</Label>
                <Col md={9}>
                    <Field name="kode_tinggal" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Jenis Tempat Tinggal --</option>
                        {Array.isArray(ref_tinggal)
                            ? ref_tinggal.map((data, key) => (
                                <option value={data.tinggal_id} key={key}>
                                    {data.jenis_tinggal}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_transportasi" md={3}>Transportasi</Label>
                <Col md={9}>
                    <Field name="kode_transportasi" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Transportasi --</option>
                        {Array.isArray(ref_transportasi)
                            ? ref_transportasi.map((data, key) => (
                                <option value={data.transportasi_id} key={key}>
                                    {data.transportasi_nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_provinsi" md={3}>Provinsi</Label>
                <Col md={9}>
                    <Field
                        name="kode_provinsi"
                        component={InputBs}
                        type="select"
                        onChange={handleBioProvinsi}
                    >
                        {' '}
                        <option value="">-- Pilih Provinsi --</option>
                        {Array.isArray(ref_provinsi)
                            ? ref_provinsi.map((data, key) => (
                                <option value={data.kode} key={key}>
                                    {data.nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_kabkot" md={3}>Kabupaten/Kota</Label>
                <Col md={9}>
                    <Field
                        name="kode_kabkot"
                        component={InputBs}
                        type="select"
                        onChange={handleBioKabkot}
                    >
                        {' '}
                        <option value="">-- Pilih Kabupaten/Kota --</option>
                        {Array.isArray(ref_kabkot)
                            ? ref_kabkot.map((data, key) => (
                                <option value={data.kode} key={key}>
                                    {data.nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_kecamatan" sm={3}>Kecamatan</Label>
                <Col sm={9}>
                    <Field name="kode_kecamatan" component={InputBs} type="select">
                        {' '}
                        <option value="">-- Pilih Kecamatan --</option>
                        {Array.isArray(ref_kecamatan)
                            ? ref_kecamatan.map((data, key) => (
                                <option value={data.kode} key={key}>
                                    {data.nama}
                                </option>
                            ))
                            : ''}
                    </Field>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kelurahan" md={3}>Kelurahan/Desa</Label>
                <Col md={9}>
                    <Field
                        name="kelurahan"
                        component={InputBs}
                        type="text"
                        placeholder="Kelurahan/Desa"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="dusun" md={3}>Dusun</Label>
                <Col md={9}>
                    <Field
                        name="dusun"
                        component={InputBs}
                        type="text"
                        placeholder="Dusun"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="alamat" md={3}>Alamat Lengkap</Label>
                <Col md={9}>
                    <Field
                        name="alamat"
                        component={InputBs}
                        type="textarea"
                        rows="3"
                        placeholder="Alamat Lengkap"
                    />{' '}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>RT &amp; RW</Label>
                <Col md={4}>
                    <Field name="rt" component={InputBs} type="text" placeholder="RT" />{' '}
                </Col>
                <Col md={5} xs={12}>
                    <Field name="rw" component={InputBs} type="text" placeholder="RW" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="kode_pos" md={3}>Kode POS</Label>
                <Col md={9}>
                    <Field
                        name="kode_pos"
                        component={InputBs}
                        type="text"
                        placeholder="Kode POS"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="nik" md={3}>NIK</Label>
                <Col md={9}>
                    <Field name="nik" component={InputBs} type="text" placeholder="NIK" />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="npwp" md={3}>NPWP</Label>
                <Col md={9}>
                    <Field
                        name="npwp"
                        component={InputBs}
                        type="text"
                        placeholder="NPWP"
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="telp" md={3}>Nomor Telepon</Label>
                <Col md={9}>
                    <Field
                        name="telp"
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
            <FormGroup row>
                <Label for="hp" md={3}>Nomor Handphone</Label>
                <Col md={9}>
                    <Field
                        name="hp"
                        component={InputBs}
                        type="text"
                        placeholder="Nomor Handphone"
                        pattern="[0-9]{0,13}"
                        title="Hanya isi dengan angka 0-9. Maksimal 13 digit."
                    />
                    <FormText color="muted">
                        Hanya isi dengan angka. Maksimal 13 digit.
                    </FormText>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="email" md={3}>Email</Label>
                <Col md={9}>
                    <Field
                        name="email"
                        component={InputBs}
                        type="email"
                        placeholder="Email"
                    // pattern="[0-9]{0,13}"
                    // title="Hanya isi dengan angka 0-9. Maksimal 13 digit."
                    />
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label md={3} xs={12}>KPS/KKS/KIS</Label>
                <Col md={4} xs={12}>
                    <FormGroup check>
                        <Label check>
                            <Field
                                name="terima_kps"
                                component={InputBs}
                                type="radio"
                                value="0"
                            />{' '}Tidak Terima</Label>
                    </FormGroup>
                    <FormGroup check>
                        <Label check>
                            <Field
                                name="terima_kps"
                                component={InputBs}
                                type="radio"
                                value="1"
                            />{' '}Terima</Label>
                    </FormGroup>
                </Col>
            </FormGroup>
            {terima_kps === '1' && (
                <FormGroup row>
                    <Label for="no_kps" md={3} xs={12}>Nomor KPS/KKS/KIS</Label>
                    <Col md={9}>
                        <Field
                            name="no_kps"
                            component={InputBs}
                            type="text"
                            placeholder="Nomor KPS/KKS/KIS"
                        />
                    </Col>
                </FormGroup>
            )}
            <FormGroup row>
                <Col md={{ size: 12 }} xs="12">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
            </FormGroup>
            <FormGroup row>
                <Col md={{ size: 9 }} xs="12">
                    <Alert color="info">
                        <ul>
                            <li>
                                <b>NIK</b> : Nomor Induk Kependudukan
                            </li>
                            <li>
                                <b>NPWP</b> : Nomor Pokok Wajib Pajak
                            </li>
                            <li>
                                <b>KPS/KKS/KIS</b> : Kartu Perlindungan Sosial/ Kartu Keluarga
                Sejahtera/ Kartu Indonesia Sehat
                            </li>
                        </ul>
                        {/* NPWP{" "}
            <b>"SIMPAN"</b> agar data tersimpan! */}
                    </Alert>
                </Col>
                <Col md={{ size: 3 }} xs="12">
                    <Button
                        type="submit"
                        color="success"
                        block
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save"></i> Simpan
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};

class BiodataPribadi extends React.Component {
    constructor(props) {
        super(props);
        this.state = { kpsDisabled: true };
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(bio_agama.fetchForBioCmahasiswa());
        this.props.dispatch(bio_tinggal.fetchForBioCmahasiswa());
        this.props.dispatch(bio_transportasi.fetchForBioCmahasiswa());
        this.props.dispatch(bio_provinsi.fetchBioProvinsi());
        this.props.dispatch(bio_cmahasiswa.fetchAllData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        // // var formData = new FormData();
        // var data = {};
        // for (var key in values) {
        //   data[key] = values[key];
        // }
        // // console.log(typeof values);
        // console.log(data);
        this.props.dispatch(
            bio_cmahasiswa.updateData(cookies.get(cookieName), values)
        );
        this.props.dispatch(reset('BiodataPribadi'));
        this.props.updateVerifikasi();
    }


    render() {
        return (
            <Card body>
                <CardTitle>Biodata Pribadi</CardTitle>
                <Alert color="warning">
                    <i className="fa fa-info-circle"></i> Seluruh kolom pada Biodata
          Pribadi <b>Wajib Diisi</b>
                </Alert>
                <FormBiodataPribadi
                    onSubmit={this.submitForm}
                    initialValues={this.props.bio_cmahasiswa}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormBiodataPribadi = reduxForm({
    form: 'BiodataPribadi',
    enableReinitialize: true,
})(FormBiodataPribadi);

const selector = formValueSelector('BiodataPribadi');

FormBiodataPribadi = connect(
    (store) => {
        let { penghasilan_cmahasiswa, terima_kps } = selector(store, 'penghasilan_cmahasiswa', 'terima_kps');
        return {
            penghasilan_cmahasiswa,
            terima_kps,
            ref_agama: store.bio_agama.bio_agama_cmahasiswa,
            ref_tinggal: store.bio_tinggal.bio_tinggal_cmahasiswa,
            ref_transportasi: store.bio_transportasi.bio_transportasi_cmahasiswa,
            ref_provinsi: store.bio_provinsi.bio_provinsi,
            ref_kabkot: store.bio_kabkot.bio_kabkot_cmahasiswa,
            ref_kecamatan: store.bio_kecamatan.bio_kecamatan_cmahasiswa,
        };
    },
    {
        bio_kabkot,
        bio_kecamatan,
    }
)(FormBiodataPribadi);

export default connect((store) => ({
    bio_cmahasiswa: store.bio_cmahasiswa.bio_cmahasiswa,
    cmahasiswa: store.cmahasiswa.cmahasiswa,
}))(BiodataPribadi);
