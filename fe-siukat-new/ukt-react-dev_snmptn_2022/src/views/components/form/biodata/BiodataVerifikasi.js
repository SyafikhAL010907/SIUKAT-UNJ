import React from "react";
import { Card, Button, CardTitle, Row, Col, Alert, Collapse } from "reactstrap";
import { Redirect } from "react-router-dom";
import { reset } from "redux-form";
import { pendukung, cmahasiswa, bio_cmahasiswa } from "../../../../actions";
import { files } from "../../../../api";
import { connect } from "react-redux";
import { cookies, cookieName } from "../../../../global";
import { BioPribadi, BioOrangTua, BioSekolah } from "./details";

// let FormSuratKebenaran = (props) => {
//   const {
//     handleSubmit,
//     pristine,
//     submitting,
//     scan_pernyataan_kebenaran,
//     unduhSuratKebenaran,
//     textSuratKebenaran,
//   } = props;
//   return (
//     <Form onSubmit={handleSubmit}>
//       <div>
//         <i className="fa fa-info-circle"></i> Berikut ini tahapan untuk
//         menyelesaikan surat pernyataan kebenaran data:
//       </div>
//       <ol>
//         <li>
//           <Button size="sm" color="danger" onClick={unduhSuratKebenaran}>
//             <i className="fa fa-download"></i> {textSuratKebenaran}
//           </Button>
//         </li>
//         <li>Cetak surat pernyataan kebenaran data;</li>
//         <li>
//           Tanda tangani surat pernyataan kebenaran data apabila seluruh data
//           sudah benar;
//         </li>
//         <li>Scan surat pernyataan kebenaran data;</li>
//         <li>Unggah surat pernyataan kebenaran data pada form di bawah ini.</li>
//         <li>Klik tombol .</li>
//       </ol>
//       <hr />

//       <FormGroup row>
//         <Label for="file_scan_pernyataan_kebenaran" md={3}>
//           Surat Pernyataan Kebenaran Data
//         </Label>
//         <Col md={5}>
//           <Field
//             component={InputFileBs}
//             type="file"
//             name="file_scan_pernyataan_kebenaran"
//             id="file_scan_pernyataan_kebenaran"
//           />
//           <FormText color="muted">
//             <ul className="list-reset">
//               <li>Ekstensi berkas berupa PDF;</li>
//               <li>Ukuran berkas tidak lebih dari 500KB.</li>
//             </ul>
//           </FormText>
//         </Col>
//         {scan_pernyataan_kebenaran && (
//           <Col md={4}>
//             <a
//               href={
//                 storage +
//                 "/" +
//                 props.initialValues.no_peserta +
//                 "/" +
//                 scan_pernyataan_kebenaran
//               }
//               target="_blank"
//               rel="noopener noreferrer"
//               className="btn btn-success btn-sm btn-block"
//             >
//               <i className="fa fa-file"></i> Lihat Surat Pernyataan Kebenaran
//               Data yang Anda Unggah
//             </a>
//           </Col>
//         )}
//       </FormGroup>
//       <FormGroup row>
//         <Col md={3}></Col>
//         <Col md={5}>
//           <Button
//             type="submit"
//             color="success"
//             block
//             disabled={pristine || submitting}
//           >
//             <i className="fa fa-save"></i> Simpan
//           </Button>
//         </Col>
//       </FormGroup>
//     </Form>
//   );
// };
class BiodataVerifikasi extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsePribadi: false,
            collapseOrangTua: false,
            collapseSekolah: false,

            textSuratKebenaran:
                "Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani",
        };

        this.toggle = this.toggle.bind(this);
        this.unduhSuratKebenaran = this.unduhSuratKebenaran.bind(this);
    }
    UNSAFE_componentWillMount() {
        this.props.dispatch(cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(bio_cmahasiswa.getByLoggedIn(cookies.get(cookieName)));
        this.props.dispatch(pendukung.getByLoggedIn(cookies.get(cookieName)));
    }
    submitForm = (values) => {
        var formData = new FormData();
        for (var key in values) {
            var file = key.startsWith("file_scan") ? key : null;
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
        this.props.dispatch(reset("DataSuratKebenaran"));

        this.props.updateVerifikasi();
    };
    toggle = (stateName, val) => {
        var obj = { [stateName]: val };
        for (var key in this.state) {
            if (key === "textSuratKebenaran") {
                obj[key] =
                    "Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani";
            } else if (key !== stateName) {
                obj[key] = false;
            }
        }
        this.setState(obj);
    };
    verify = () => {
        // this.props.dispatch(cmahasiswa.rendahSelesai(cookies.get(cookieName)));
        this.props.dispatch(bio_cmahasiswa.selesaiIsi(cookies.get(cookieName)));
    }
    unduhSuratKebenaran = () => {
        this.setState({
            textSuratKebenaran: "Sedang Mengunduh...",
        });
        files
            .unduhSuratKebenaran(cookies.get(cookieName))
            .then((response) => {
                this.setState({
                    textSuratKebenaran:
                        "Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani",
                });
            })
            .catch((err) => {
                this.setState({
                    textSuratKebenaran:
                        "Unduh Surat Pernyataan Kebenaran Data yang Perlu Ditandatangani",
                });
            });
    }
    render() {
        if (this.props.bio_cmahasiswa.flag_lengkap == "1") {
            return <Redirect to="/main/biodata/selesai-isi-biodata" />;
        }
        return (
            <Card body>
                <CardTitle>Verifikasi Biodata </CardTitle>

                {(this.props.allow === undefined || this.props.allow === 0) && (
                    <Alert color="warning">
                        <i className="fa fa-info-circle"></i> Verifikasi Biodata dilakukan
            ketika seluruh data telah terisi.
                    </Alert>
                )}

                {this.props.allow !== undefined && this.props.allow !== 0 && (
                    <div>
                        {/* <FormSuratKebenaran
              onSubmit={this.submitForm}
              initialValues={this.props.pendukung}
              unduhSuratKebenaran={this.unduhSuratKebenaran}
              textSuratKebenaran={this.state.textSuratKebenaran}
            /> */}

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
                                                    "collapsePribadi",
                                                    !this.state.collapsePribadi
                                                )
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapsePribadi}>
                                    <BioPribadi />
                                </Collapse>
                            </div>

                            {/* Data Ayah */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-user"></i> Data Orang Tua dan Wali
                  <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle(
                                                    "collapseOrangTua",
                                                    !this.state.collapseOrangTua
                                                )
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseOrangTua}>
                                    <BioOrangTua />
                                </Collapse>
                            </div>

                            {/* Data Sekolah */}
                            <div>
                                <legend className="clearfix">
                                    <i className="fa fa-graduation-cap"></i> Data Sekolah
                  <div className="pull-right">
                                        <Button
                                            size="sm"
                                            color="success"
                                            onClick={() =>
                                                this.toggle(
                                                    "collapseSekolah",
                                                    !this.state.collapseSekolah
                                                )
                                            }
                                        >
                                            <i className="fa fa-bars"></i>
                                        </Button>
                                    </div>
                                </legend>
                                <Collapse isOpen={this.state.collapseSekolah}>
                                    <BioSekolah />
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
                                {/* <Button color="success" block onClick={this.verify.bind(this)}> */}
                                <Button color="success" block onClick={this.verify.bind(this)}>
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

// FormSuratKebenaran = reduxForm({
//   form: "DataSuratKebenaran",
//   enableReinitialize: true,
// })(FormSuratKebenaran);

// const selector = formValueSelector("DataSuratKebenaran");

// FormSuratKebenaran = connect((store) => {
//   let scan_pernyataan_kebenaran = selector(store, "scan_pernyataan_kebenaran");
//   return {
//     scan_pernyataan_kebenaran,
//   };
// })(FormSuratKebenaran);

export default connect((store) => ({
    pendukung: store.pendukung.pendukung,
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    bio_cmahasiswa: store.bio_cmahasiswa.bio_cmahasiswa,
}))(BiodataVerifikasi);
