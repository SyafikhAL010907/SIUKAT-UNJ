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
    Row
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputDayPicker,
    InputFileBs,
    money,
    SyaratScan,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { ayah, pekerjaan, kabkot, kecamatan, provinsi } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, rupiah, storage } from '../../../../global';

let FormAyahSeleksi = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        dispatch,
        ref_pekerjaan,
        ref_provinsi_ayah,
        ref_kabkot_ayah,
        ref_kecamatan_ayah,
        status_ayah,
        penghasilan_ayah,
        sampingan_ayah,
        pekerjaan_ayah,
    } = props;

    const handleProvinsi = (e) => {
        dispatch(kabkot.fetchForAyah(e.target.value));
        dispatch(
            { type: 'FETCH_KECAMATAN_AYAH_FULFILLED', payload: [] }
        );
    };
    const handleKabkot = (e) => {
        dispatch(kecamatan.fetchForAyah(e.target.value));
    };
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row className="mb-4">
                <Label for="nama_ayah" md={3}>
                    Nama Lengkap
                </Label>
                <Col md={9}>
                    <Field
                        name="nama_ayah"
                        component={InputBs}
                        type="text"
                        placeholder="Nama Lengkap"
                    />
                </Col>
            </FormGroup>
            <FormGroup row className="mb-4">
                <Label for="status_ayah" md={3}></Label>
                <Col md={9}>
                    <Row>
                        <Col md={3}>
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
                        <Col md={9}>
                            <FormGroup check>
                                <Label check>
                                    <Field
                                        name="status_ayah"
                                        component={InputBs}
                                        type="radio"
                                        value="wafat"
                                    />{' '}Wafat / Tidak Diketahui Keberadaaanya</Label>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
            </FormGroup>

            {status_ayah === 'hidup' && (
                <div>
                    <FormGroup row className="mb-4">
                        <Label for="nik_ayah" md={3}>
                            NIK
                        </Label>
                        <Col md={9}>
                            <Field
                                name="nik_ayah"
                                component={InputBs}
                                type="text"
                                placeholder="NIK Ayah"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="file_scan_ktp_ayah" md={3}>
                            KTP Ayah
                        </Label>
                        <Col md={5}>
                            <Field
                                component={InputFileBs}
                                type="file"
                                className="form-control"
                                name="file_scan_ktp_ayah"
                                id="file_scan_ktp_ayah"
                                accept="application/pdf"
                            />
                            <SyaratScan />
                        </Col>
                        {props.initialValues.scan_ktp_ayah && (
                                <a
                                    href={
                                        storage +
                                        '/' +
                                        props.initialValues.scan_ktp_ayah
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="modern-btn-primary py-2 w-100 btn text-white"
                                    style={{fontSize: '0.85rem'}}
                                >
                                    <i className="fa fa-file-pdf-o mr-2"></i> Lihat KTP Ayah
                                </a>
                        )}
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label md={3} xs={12}>
                            Tempat {'&'} Tanggal Lahir
                        </Label>
                        <Col md={5}>
                            <Field
                                name="tempat_lahir_ayah"
                                component={InputBs}
                                type="text"
                                placeholder="Tempat Lahir"
                            />{' '}
                        </Col>
                        <Col md={4} xs={12}>
                            <Field
                                name="tanggal_lahir_ayah"
                                component={InputDayPicker}
                                startYear={1940}
                                placeholder="Tanggal Lahir"
                            />
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="alamat_ayah" md={3}>
                            Alamat Lengkap
                        </Label>
                        <Col md={9}>
                            <Field
                                name="alamat_ayah"
                                component={InputBs}
                                type="textarea"
                                rows="3"
                                placeholder="Alamat Lengkap"
                            />{' '}
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="provinsi_ayah" md={3}>
                            Provinsi
                        </Label>
                        <Col md={9}>
                            <Field
                                name="provinsi_ayah"
                                component={InputBs}
                                type="select"
                                onChange={handleProvinsi}
                            >
                                {' '}
                                <option value="">-- Pilih Provinsi --</option>
                                {Array.isArray(ref_provinsi_ayah)
                                    ? ref_provinsi_ayah.map((data, key) => (
                                        <option value={data.provinsi_id} key={key}>
                                            {data.provinsi_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kabkot_ayah" md={3}>
                            Kab/Kota
                        </Label>
                        <Col md={9}>
                            <Field
                                name="kabkot_ayah"
                                component={InputBs}
                                type="select"
                                onChange={handleKabkot}
                            >
                                {' '}
                                <option value="">-- Pilih Kabupaten/Kota --</option>
                                {Array.isArray(ref_kabkot_ayah)
                                    ? ref_kabkot_ayah.map((data, key) => (
                                        <option value={data.kab_id} key={key}>
                                            {data.kab_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="kecamatan_ayah" sm={3}>
                            Kecamatan
                        </Label>
                        <Col sm={9}>
                            <Field name="kecamatan_ayah" component={InputBs} type="select">
                                {' '}
                                <option value="">-- Pilih Kecamatan --</option>
                                {Array.isArray(ref_kecamatan_ayah)
                                    ? ref_kecamatan_ayah.map((data, key) => (
                                        <option value={data.kecam_id} key={key}>
                                            {data.kecam_nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    <FormGroup row className="mb-4">
                        <Label for="pekerjaan_ayah" md={3}>
                            Pekerjaan
                        </Label>
                        <Col md={9}>
                            <Field
                                type="select"
                                component={InputBs}
                                name="pekerjaan_ayah"
                                id="pekerjaan_ayah"
                            >
                                <option value="">-- Pilih Pekerjaan --</option>
                                {Array.isArray(ref_pekerjaan)
                                    ? ref_pekerjaan.map((data, key) => (
                                        <option value={data.kode} key={key}>
                                            {data.nama}
                                        </option>
                                    ))
                                    : ''}
                            </Field>
                        </Col>
                    </FormGroup>
                    {/* {pekerjaan_ayah !== "11" && ( */}
                    <div>
                        <FormGroup row className="mb-4">
                            <Label for="penghasilan_ayah" md={3}>
                                Penghasilan
                            </Label>
                            <Col md={5} xs={12}>
                                <Field
                                    type="number"
                                    component={InputBs}
                                    pattern="[0-9]*"
                                    title="Hanya isi dengan angka (0-9)"
                                    name="penghasilan_ayah"
                                    id="penghasilan_ayah"
                                    placeholder="Penghasilan Ayah"
                                    validate={[money]}
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>
                                            Penghasilan <b>per bulan</b>;
                                        </li>
                                    </ul>
                                </FormText>
                            </Col>
                            <Col md={4} xs={12}>
                                <Alert color="success">{rupiah(penghasilan_ayah)}</Alert>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="sampingan_ayah" md={3}>
                                Sampingan
                            </Label>
                            <Col md={5} xs={12}>
                                <Field
                                    type="number"
                                    component={InputBs}
                                    pattern="[0-9]*"
                                    title="Hanya isi dengan angka (0-9)"
                                    name="sampingan_ayah"
                                    id="sampingan_ayah"
                                    placeholder="Penghasilan Sampingan Ayah"
                                />
                                <FormText color="muted">
                                    <ul className="list-reset">
                                        <li>
                                            Sampingan <b>per bulan</b>;
                                        </li>
                                    </ul>
                                </FormText>
                            </Col>
                            <Col md={4} xs={12}>
                                <Alert color="success">{rupiah(sampingan_ayah)}</Alert>
                            </Col>
                        </FormGroup>
                        <FormGroup row className="mb-4">
                            <Label for="file_scan_slip_ayah" md={3}>
                                {pekerjaan_ayah !== '11' && 'Slip Gaji / Bukti Penghasilan'}
                                {pekerjaan_ayah === '11' && 'Surat Keterangan Tidak Bekerja'}
                            </Label>
                            <Col md={5}>
                                <Field
                                    component={InputFileBs}
                                    type="file"
                                    name="file_scan_slip_ayah"
                                    id="file_scan_slip_ayah"
                                    accept="application/pdf"
                                />
                                {pekerjaan_ayah !== '11' && (
                                    <SyaratScan syarat={['Bukti Penghasilan Bulan Terakhir']} />
                                )}
                                {pekerjaan_ayah === '11' && (
                                    <SyaratScan
                                        syarat={[
                                            'Surat Keterangan Dari RT dan RW untuk orang tua yang tidak bekerja',
                                        ]}
                                    />
                                )}
                            </Col>
                            {props.initialValues.scan_slip_ayah && (
                                <Col md={4}>
                                    <a
                                        href={
                                            storage +
                                            '/' +
                                            props.initialValues.scan_slip_ayah
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-success btn-block"
                                    >
                                        <i className="fa fa-file"></i>
                                        {pekerjaan_ayah !== '11' && 'Lihat Slip Gaji Ayah'}
                                        {pekerjaan_ayah === '11' && 'Lihat Surat Keterangan Ayah'}
                                    </a>
                                </Col>
                            )}
                        </FormGroup>
                    </div>
                    {/* )} */}
                    <FormGroup row className="mb-4">
                        <Label for="telepon_ayah" md={3}>
                            Nomor Telepon
                        </Label>
                        <Col md={9}>
                            <Field
                                name="telepon_ayah"
                                component={InputBs}
                                type="text"
                                placeholder="Nomor Telepon"
                                pattern="[0-9]{0,13}"
                                title="Hanya isi dengan angka 0-9. Maksimal 13 digit."
                            />
                            <FormText color="muted">
                                <ul className="list-reset">
                                    <li>Hanya isi dengan angka. Maksimal 13 digit;</li>
                                    <li>
                                        Isi dengan angka{' '}
                                        <i>
                                            <b>nol (0)</b>
                                        </i>{' '}
                    jika tidak memiliki nomor telepon.
                                    </li>
                                </ul>
                            </FormText>
                        </Col>
                    </FormGroup>
                </div>
            )}

            <FormGroup row className="mt-5 border-top pt-4 mb-0">
                <Col md={{ size: 8 }} xs="12">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 4 }} xs="12">
                    <Button
                        type="submit"
                        className="modern-btn-primary w-100 py-3 shadow-sm font-weight-bold"
                        disabled={pristine || submitting}
                    >
                        <i className="fa fa-save mr-2"></i> Simpan Data Ayah
                    </Button>
                </Col>
            </FormGroup>
        </Form>
    );
};
class DataAyahSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(pekerjaan.fetchPekerjaan(cookies.get(cookieName)));
        this.props.dispatch(provinsi.fetchProvinsi());
        this.props.dispatch(ayah.fetchAllData(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            var file = key.startsWith('file_scan') ? key : null;
            if (file) {
                formData.append(key, values[key][0]);
                document.getElementById(file).value = null;
            } else {
                formData.append(key, values[key]);
            }
        }

        this.props.dispatch(ayah.updateData(cookies.get(cookieName), formData));
        this.props.dispatch(reset('DataAyahSeleksi'));

        this.props.updateVerifikasi();
    }
    render() {
        return (
            <Card className="premium-card p-4 p-md-5">
                <CardTitle tag="h4" className="mb-4">Data Orang Tua: Ayah</CardTitle>
                <Alert color="warning" className="rounded-lg border-0 shadow-sm mb-4">
                    <i className="fa fa-info-circle mr-2"></i>
                    <strong>Seluruh kolom pada Data Ayah Wajib Diisi</strong>
                </Alert>
                <FormAyahSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.ayah}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormAyahSeleksi = reduxForm({
    form: 'DataAyahSeleksi',
    enableReinitialize: true,
})(FormAyahSeleksi);

const selector = formValueSelector('DataAyahSeleksi');

FormAyahSeleksi = connect(
    (store) => {
        let {
            status_ayah,
            penghasilan_ayah,
            sampingan_ayah,
            pekerjaan_ayah,
        } = selector(
            store,
            'status_ayah',
            'penghasilan_ayah',
            'sampingan_ayah',
            'pekerjaan_ayah'
        );
        return {
            status_ayah,
            penghasilan_ayah,
            sampingan_ayah,
            pekerjaan_ayah,

            ref_provinsi_ayah: store.provinsi.provinsi,
            ref_kabkot_ayah: store.kabkot.kabkot_ayah,
            ref_kecamatan_ayah: store.kecamatan.kecamatan_ayah,
            ref_pekerjaan: store.pekerjaan.pekerjaan,
        };
    }
)(FormAyahSeleksi);

export default connect((store) => ({
    ayah: store.ayah.ayah,
}))(DataAyahSeleksi);
