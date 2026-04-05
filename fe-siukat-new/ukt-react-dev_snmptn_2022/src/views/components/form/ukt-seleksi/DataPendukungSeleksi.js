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
import { Field, reduxForm, reset, formValueSelector } from 'redux-form';
import {
    InputBs,
    InputFileBs,
    AlertFormLengkap,
    AlertFormBelumLengkap,
} from '../';
import { pendukung } from '../../../../actions';
import { connect } from 'react-redux';
import { cookies, cookieName, storage } from '../../../../global';

let FormPendukungSeleksi = (props) => {
    const { handleSubmit, pristine, submitting, scan_kk } = props;
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup row>
                <Label for="tanggungan" md={3}>
                    Jumlah Tanggungan
                </Label>
                <Col md={9}>
                    <Field
                        component={InputBs}
                        type="text"
                        name="tanggungan"
                        id="tanggungan"
                        placeholder="Jumlah Tanggungan"
                    />
                    <FormText>Termasuk Kepala Keluarga</FormText>
                </Col>
            </FormGroup>
            <FormGroup row>
                <Label for="file_scan_kk" md={3}>
                    Kartu Keluarga
                </Label>
                <Col md={5}>
                    <Field
                        component={InputFileBs}
                        type="file"
                        accept="application/pdf"
                        name="file_scan_kk"
                        id="file_scan_kk"
                    />
                    <FormText color="muted">
                        <ul className="list-reset">
                            <li>Ekstensi berkas berupa PDF;</li>
                            <li>Ukuran berkas tidak lebih dari 500KB.</li>
                        </ul>
                    </FormText>
                </Col>
                {scan_kk && (
                    <Col md={4}>
                        <a
                            href={
                                storage + '/' + scan_kk
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-block"
                        >
                            <i className="fa fa-file"></i> Lihat Kartu Keluarga
                        </a>
                    </Col>
                )}
            </FormGroup>

            <FormGroup row>
                <Col md={{ size: 9 }} xs="12">
                    {!props.allow ? <AlertFormBelumLengkap /> : <AlertFormLengkap />}
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
class DataPendukungSeleksi extends React.Component {
    UNSAFE_componentWillMount() {
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
        this.props.dispatch(reset('DataPendukungSeleksi'));
        this.props.updateVerifikasi();
    }
    render() {
        return (
            <Card body>
                <CardTitle>Data Pendukung</CardTitle>
                <Alert color="warning">
                    <i className="fa fa-info-circle"></i>
                    <span> Jumlah tanggungan termasuk semua orang di kartu keluarga. <b>Misal:</b></span>
                    <ul>
                        <li>Ayah;</li>
                        <li>Ibu;</li>
                        <li>2 Orang Anak.</li>
                    </ul>
                    Maka, <b>jumlah tanggungan = 4.</b>
                </Alert>
                <FormPendukungSeleksi
                    onSubmit={this.submitForm}
                    initialValues={this.props.pendukung}
                    allow={this.props.allow}
                />
            </Card>
        );
    }
}

FormPendukungSeleksi = reduxForm({
    form: 'DataPendukungSeleksi',
    enableReinitialize: true,
})(FormPendukungSeleksi);

const selector = formValueSelector('DataPendukungSeleksi');

FormPendukungSeleksi = connect((store) => {
    let scan_kk = selector(store, 'scan_kk');
    return {
        scan_kk,
    };
})(FormPendukungSeleksi);

export default connect((store) => ({
    pendukung: store.pendukung.pendukung,
}))(DataPendukungSeleksi);
