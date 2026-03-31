import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Row,
    Col,
    Alert,
    Form,
    FormGroup,
    Label,
    FormText,
    Collapse,
} from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { InputFileBs } from '../';
import { pendukung, cmahasiswa } from '../../../../actions';
import { files } from '../../../../api';
import { connect } from 'react-redux';
import { cookies, cookieName, storage } from '../../../../global';
import {
    Ayah,
    Ibu,
    Kendaraan,
    Listrik,
    Pendukung,
    Pribadi,
    Rumah,
    Wali,
} from './details';

let FormSuratKebenaran = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        scan_pernyataan_kebenaran,
        unduhSuratKebenaran,
        textSuratKebenaran,
    } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <div>
                <i className="fa fa-info-circle"></i> Berikut ini tahapan untuk
        menyelesaikan surat pernyataan kebenaran data:
            </div>
            <ol>
                <li>
                    <Button size="sm" color="danger" onClick={unduhSuratKebenaran}>
                        <i className="fa fa-download"></i> {textSuratKebenaran}
                    </Button>
                </li>
                <li>Cetak surat pernyataan kebenaran data;</li>
                <li>
                    Tanda tangani surat pernyataan kebenaran data apabila seluruh data
                    sudah benar;
                </li>
                <li>Scan surat pernyataan kebenaran data;</li>
                <li>Unggah surat pernyataan kebenaran data pada form di bawah ini.</li>
                <li>Klik tombol .</li>
            </ol>
            <hr />

            <FormGroup row>
                <Label for="file_scan_pernyataan_kebenaran" md={3}>
                    Surat Pernyataan Kebenaran Data
                </Label>
                <Col md={5}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        name="file_scan_pernyataan_kebenaran"
                        id="file_scan_pernyataan_kebenaran"
                        accept="application/pdf"
                    />
                    <FormText color="muted">
                        <ul className="list-reset">
                            <li>Ekstensi berkas berupa PDF;</li>
                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_pernyataan_kebenaran && (
                    <Col md={4}>
                        <a
                            href={
                                storage +
                                '/' +
                                props.initialValues.no_peserta +
                                '/' +
                                scan_pernyataan_kebenaran
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm btn-block"
                        >
                            <i className="fa fa-file"></i> Lihat Surat Pernyataan Kebenaran
              Data yang Anda Unggah
                        </a>
                    </Col>
                )}
            </FormGroup>
            <FormGroup row>
                <Col md={3}></Col>
                <Col md={5}>
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
class VerifikasiSeleksi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsePribadi: false,
            collapseAyah: false,
            collapseIbu: false,
            collapseWali: false,
            collapseRumah: false,
            collapseListrik: false,
            collapseKendaraan: false,
            collapsePendukung: false,

            textSuratKebenaran:
                'Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani',
        };

    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(pendukung.getByLoggedIn(cookies.get(cookieName)));
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
        this.props.dispatch(
            pendukung.updateData(cookies.get(cookieName), formData)
        );
        this.props.dispatch(reset('DataSuratKebenaran'));

        this.props.updateVerifikasi();
    }
    toggle = (stateName, val) => {
        var obj = { [stateName]: val };
        for (var key in this.state) {
            if (key === 'textSuratKebenaran') {
                obj[key] =
                    'Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani';
            } else if (key !== stateName) {
                obj[key] = false;
            }
        }
        this.setState(obj);
    }
    verify = () => {
        this.props.dispatch(cmahasiswa.rendahSelesai(cookies.get(cookieName)));
    }
    unduhSuratKebenaran = () => {
        this.setState({
            textSuratKebenaran: 'Sedang Mengunduh...',
        });
        files
            .unduhSuratKebenaran(cookies.get(cookieName))
            .then(() => {
                this.setState({
                    textSuratKebenaran:
                        'Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani',
                });
            })
            .catch(() => {
                this.setState({
                    textSuratKebenaran:
                        'Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani',
                });
            });
    }
    render() {
        if (this.props.cmahasiswa.flag === 'selesai_isi') {
            return <Redirect to="/main/ukt/selesai-isi" />;
        }
        console.log(
            'kebenaran :' + this.props.pendukung.scan_pernyataan_kebenaran === ''
        );
        console.log(
            'ukt tinggi :' + this.props.pendukung.scan_pernyataan_ukt_tinggi === ''
        );
        return (
            <Card body>
                <CardTitle>Verifikasi Data</CardTitle>

                {(this.props.allow === undefined || this.props.allow === 0) && (
                    <Alert color="warning">
                        <i className="fa fa-info-circle"></i> Verifikasi dilakukan ketika
            seluruh data telah terisi.
                    </Alert>
                )}

                {this.props.allow !== undefined && this.props.allow !== 0 && (
                    <div>
                        <FormSuratKebenaran
                            onSubmit={this.submitForm}
                            initialValues={this.props.pendukung}
                            unduhSuratKebenaran={this.unduhSuratKebenaran}
                            textSuratKebenaran={this.state.textSuratKebenaran}
                        />

                        <div>
                            {/* Data Pribadi */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-user"></i> Data Pribadi
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle(
                                                    'collapsePribadi',
                                                    !this.state.collapsePribadi
                                                )
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapsePribadi}>
                                    <Pribadi />
                                </Collapse>
                            </div>

                            {/* Data Ayah */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-user"></i> Data Ayah
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle('collapseAyah', !this.state.collapseAyah)
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseAyah}>
                                    <Ayah />
                                </Collapse>
                            </div>

                            {/* Data Ibu */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-user"></i> Data Ibu
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle('collapseIbu', !this.state.collapseIbu)
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseIbu}>
                                    <Ibu />
                                </Collapse>
                            </div>

                            {/* Data Wali */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-user"></i> Data Wali
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle('collapseWali', !this.state.collapseWali)
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseWali}>
                                    <Wali />
                                </Collapse>
                            </div>

                            {/* Data Rumah */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-home"></i> Data Rumah
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle('collapseRumah', !this.state.collapseRumah)
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseRumah}>
                                    <Rumah />
                                </Collapse>
                            </div>

                            {/* Data Listrik */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-flash"></i> Data Listrik
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle(
                                                    'collapseListrik',
                                                    !this.state.collapseListrik
                                                )
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseListrik}>
                                    <Listrik />
                                </Collapse>
                            </div>

                            {/* Data Kendaraan */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-bus"></i> Data Kendaraan
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle(
                                                    'collapseKendaraan',
                                                    !this.state.collapseKendaraan
                                                )
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseKendaraan}>
                                    <Kendaraan />
                                </Collapse>
                            </div>

                            {/* Data Pendukung */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-file-text"></i> Data Pendukung
                                    <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle(
                                                    'collapsePendukung',
                                                    !this.state.collapsePendukung
                                                )
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapsePendukung}>
                                    <Pendukung />
                                </Collapse>
                            </div>
                        </div>
                    </div>
                )}

                {this.props.verified !== 0 && (
                    <div>
                        <hr />
                        <Row>
                            <Col md={{ size: 7 }} xs="12">
                                <Alert color="danger">
                                    <i className="fa fa-info-circle"></i> Dengan ini saya
                  menyatakan bahwa data yang saya masukkan adalah data yang
                  sebenar-benarnya dan sejujur-jujurnya.
                                </Alert>
                            </Col>
                            <Col md={{ size: 5 }} xs="12">
                                <Button
                                    color="success"
                                    block
                                    onClick={this.verify.bind(this)}
                                    disabled={
                                        this.props.pendukung.scan_pernyataan_kebenaran === '' ||
                                        this.props.scan_pernyataan_ukt_tinggi === ''
                                    }
                                >
                                    <i className="fa fa-save"></i> Ya, Semua data sudah benar.
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}
            </Card>
        );
    }
}

FormSuratKebenaran = reduxForm({
    form: 'DataSuratKebenaran',
    enableReinitialize: true,
})(FormSuratKebenaran);

const selector = formValueSelector('DataSuratKebenaran');

FormSuratKebenaran = connect((store) => {
    let scan_pernyataan_kebenaran = selector(store, 'scan_pernyataan_kebenaran');
    return {
        scan_pernyataan_kebenaran,
    };
})(FormSuratKebenaran);

export default connect((store) => ({
    pendukung: store.pendukung.pendukung,
    cmahasiswa: store.cmahasiswa.cmahasiswa,
}))(VerifikasiSeleksi);
