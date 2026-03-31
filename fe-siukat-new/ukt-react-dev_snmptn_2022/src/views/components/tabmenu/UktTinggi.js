import React, { Component } from 'react';
import { Card, CardTitle, Collapse, Button, Table } from 'reactstrap';
// import PasFoto from '../../dist/img/pas_foto.jpg'
import PasFoto from '../../dist/img/PasPhoto.jpg';

class UktTinggi extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <Card body>
                <CardTitle className="clearfix">
                    <div className="pull-left">
                        <i className="fa fa-check"></i> Bersedia di UKT Kelompok Atas.
                    </div>
                    <div className="pull-right">
                        <Button color="success" size="xs" onClick={this.toggle}>
                            <i className="fa fa-search"></i> Lihat
                        </Button>
                    </div>
                </CardTitle>
                <b>
          Jika anda bersedia masuk kelompok UKT VI / VII / VIII, anda hanya
          perlu:
                </b>
                <ul>
                    <li>Mengisi data pribadi calon mahasiswa dan orang tua;</li>
                    <li>
            Mengunggah surat pernyataan yang menyatakan bahwa Anda bersedia
            masuk kelompok UKT Kelompok Atas.
                    </li>
                </ul>
                <Collapse isOpen={this.state.collapse}>
                    <Table responsive striped bordered className="login-schedule">
                        <thead>
                            <tr className="table-head-green">
                                <th width="5%" className="text-center">
                  No.
                                </th>
                                <th width="60%" className="text-center">
                  Nama Berkas
                                </th>
                                <th width="35%" className="text-center">
                  Keterangan
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="text-center">1</td>
                                <td>
                                    <b>Pas foto calon mahasiswa.</b>
                                    <ul className="list-reset">
                                        <li>Wajah tampak jelas;</li>
                                        <li>Posisi badan menghadap ke depan;</li>
                                        <li>Memakai pakaian bebas, rapi, dan sopan;</li>
                                        <li>Rasio 3:4 atau 4:6;</li>
                                        <li>Warna latar merah.</li>
                                        <li>Ekstensi gambar berupa JPG/JPEG/PNG;</li>
                                        <li>Ukuran gambar tidak lebih dari 500KB.</li>
                                    </ul>
                                </td>
                                <td className="text-center">
                                    <img src={PasFoto} width="50%" alt="Contoh Foto" />
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center">2</td>
                                <td>
                                    <b>Jika bersedia di UKT Kelompok Atas.</b>
                                    <br />
                  Surat pernyataan bersedia ditetapkan di UKT Kelompok Atas.
                                </td>
                                <td className="text-center">
                  Surat ini dapat diunduh pada tab SURAT PERNYATAAN{' '}
                                    <b>saat mengisi data</b>.
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Collapse>
            </Card>
        );
    }
}

export default UktTinggi;
