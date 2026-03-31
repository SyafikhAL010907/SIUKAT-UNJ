import React from 'react';
import {
    Card,
    Button,
    CardTitle,
    Col,
    Form,
    FormGroup,
    Label,
    FormText,
} from 'reactstrap';
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { pendukung } from '../../../../actions';
import { files } from '../../../../api';
import { InputFileBs, AlertFormLengkap, AlertFormBelumLengkap } from '../';
import { cookies, cookieName, storage } from '../../../../global';

let FormDataPendukung = (props) => {
    const {
        handleSubmit,
        pristine,
        submitting,
        scan_pernyataan_ukt_tinggi,
    } = props;

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="file_scan_pernyataan_ukt_tinggi" md={3}>
                    Surat Pernyataan
                </Label>
                <Col md={5}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        accept="application/pdf"
                        name="file_scan_pernyataan_ukt_tinggi"
                        id="file_scan_pernyataan_ukt_tinggi"
                    />
                    <FormText color="muted">
                        <ul className="list-reset">
                            <li>Ekstensi berkas berupa PDF;</li>
                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_pernyataan_ukt_tinggi && (
                    <Col md={4}>
                        <a
                            href={
                                storage +
                                '/' +
                                props.initialValues.no_peserta +
                                '/' +
                                scan_pernyataan_ukt_tinggi
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-block"
                        >
                            <i className="fa fa-file"></i> Lihat Surat Pernyataan UKT Kelompok Atas
                        </a>
                    </Col>
                )}
            </FormGroup>
            <FormGroup row>
                <Col md={{ size: 9 }}>
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
                </Col>
                <Col md={{ size: 3 }}>
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
class DataPendukung extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textSuratPernyataan: 'Unduh Surat Pernyataan UKT Kelompok Atas',
        };
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(pendukung.getByLoggedIn(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            if (key === 'file_scan_pernyataan_ukt_tinggi') {
                formData.append(key, values[key][0]);
                document.getElementById('file_scan_pernyataan_ukt_tinggi').value = null;
            } else {
                formData.append(key, values[key]);
            }
        }
        this.props.dispatch(
            pendukung.updateData(cookies.get(cookieName), formData)
        );
        this.props.dispatch(reset('DataPendukung'));
        this.props.updateVerifikasi();
    }
    unduhSuratPernyataan = () => {
        this.setState({
            textSuratPernyataan: 'Sedang mengunduh...',
        });
        files
            .unduhSuratPernyataanUKTAtas(cookies.get(cookieName))
            .then(() => {
                this.setState({
                    textSuratPernyataan: 'Unduh Surat Pernyataan UKT Kelompok Atas',
                });
            })
            .catch(() => {
                this.setState({
                    textSuratPernyataan: 'Unduh Surat Pernyataan UKT Kelompok Atas',
                });
            });
    }
    render() {
        return (
            <Card body>
                <CardTitle>Surat Pernyataan</CardTitle>
                <div>
                    <i className="fa fa-info-circle"></i> Berikut ini tahapan untuk menyelesaikan surat pernyataan:
                </div>
                <ol>
                    <li>
                        <Button
                            size="sm"
                            color="danger"
                            onClick={this.unduhSuratPernyataan.bind(this)}
                        >
                            <i className="fa fa-download"></i>{' '}
                            {this.state.textSuratPernyataan}
                        </Button>
                    </li>
                    <li>Cetak surat pernyataan;</li>
                    <li>Isi surat pernyataan;</li>
                    <li>Scan surat pernyataan;</li>
                    <li>Unggah surat pernyataan pada form di bawah ini.</li>
                </ol>
                <hr />
                <FormDataPendukung
                    onSubmit={this.submitForm}
                    initialValues={this.props.pendukung}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormDataPendukung = reduxForm({
    form: 'DataPendukung',
    enableReinitialize: true,
})(FormDataPendukung);

const selector = formValueSelector('DataPendukung');

FormDataPendukung = connect((store) => {
    let scan_pernyataan_ukt_tinggi = selector(
        store,
        'scan_pernyataan_ukt_tinggi'
    );
    return {
        scan_pernyataan_ukt_tinggi,
    };
})(FormDataPendukung);

export default connect((store) => ({
    pendukung: store.pendukung.pendukung,
}))(DataPendukung);
