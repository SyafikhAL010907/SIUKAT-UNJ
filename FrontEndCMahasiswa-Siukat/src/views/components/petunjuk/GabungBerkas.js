import React from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';

class GabungBerkas extends React.Component{
    render(){
        return(
            <Card className="premium-card p-4 p-md-5">
                <CardBody className="p-0">
                    <CardTitle tag="h4" className="mb-4">
                        <i className="fa fa-file-pdf-o text-danger mr-3"></i> Menggabungkan Berkas
                    </CardTitle>
                    <p className="text-muted mb-4">Berikut adalah cara mudah untuk menggabungkan beberapa dokumen menjadi satu berkas PDF:</p>
                    
                    <div className="instruction-section">
                        <div className="d-flex mb-4">
                            <div className="instruction-number">1</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Menggabungkan File PDF</h6>
                                <p className="small text-muted mb-2">Gunakan layanan <strong>Combine PDF</strong> untuk menyatukan beberapa file PDF:</p>
                                <Button color="danger" size="sm" className="rounded-pill px-3 mb-3" href="http://combinepdf.com/id/" target="_blank">
                                    <i className="fa fa-link mr-2"></i> Buka Website Combine PDF
                                </Button>
                                <ul className="pl-3 small text-muted">
                                    <li>Unggah berkas-berkas PDF yang ingin digabungkan.</li>
                                    <li>Tunggu hingga semua proses pengunggahan selesai.</li>
                                    <li>Klik tombol <strong>Gabungkan</strong> untuk mengunduh hasilnya.</li>
                                </ul>
                            </div>
                        </div>

                        <hr className="my-4"/>

                        <div className="d-flex">
                            <div className="instruction-number">2</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Menggabungkan File Gambar (JPG)</h6>
                                <p className="small text-muted mb-2">Gunakan layanan <strong>JPG to PDF</strong> jika berkas Anda berupa foto/gambar:</p>
                                <Button color="primary" size="sm" className="rounded-pill px-3 mb-3" href="http://jpg2pdf.com/id/" target="_blank">
                                    <i className="fa fa-link mr-2"></i> Buka Website JPG to PDF
                                </Button>
                                <ul className="pl-3 small text-muted">
                                    <li>Unggah foto/gambar yang ingin digabungkan.</li>
                                    <li>Tunggu hingga proses konversi & pengunggahan selesai.</li>
                                    <li>Klik tombol <strong>Tergabung</strong> untuk mengunduh PDF-nya.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default GabungBerkas;