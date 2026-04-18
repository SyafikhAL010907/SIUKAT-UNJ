import React from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';

class UkuranBerkas extends React.Component{
    render(){
        return(
            <Card className="premium-card p-4 p-md-5">
                <CardBody className="p-0">
                    <CardTitle tag="h4" className="mb-4">
                        <i className="fa fa-compress text-info mr-3"></i> Mengubah Ukuran Berkas
                    </CardTitle>
                    <p className="text-muted mb-4">Jika ukuran berkas Anda terlalu besar (melebihi batas maksimal), gunakan layanan kompresi berikut:</p>
                    
                    <div className="instruction-section">
                        <div className="d-flex mb-4">
                            <div className="instruction-number">1</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Kompresi File PDF</h6>
                                <p className="small text-muted mb-2">Gunakan <strong>Shrink PDF</strong> untuk mengecilkan ukuran PDF:</p>
                                <Button color="info" size="sm" className="rounded-pill px-4 mb-3 text-white" href="http://shrinkpdf.com/id/" target="_blank">
                                    <i className="fa fa-file-pdf-o mr-2"></i> Buka Website Shrink PDF
                                </Button>
                                <ul className="pl-3 small text-muted">
                                    <li>Unggah berkas PDF yang ukurannya ingin dikecilkan.</li>
                                    <li>Klik tombol <strong>Unduh</strong> setelah proses selesai.</li>
                                </ul>
                            </div>
                        </div>

                        <hr className="my-4"/>

                        <div className="d-flex mb-4">
                            <div className="instruction-number">2</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Kompresi File Gambar (JPG)</h6>
                                <Button color="warning" size="sm" className="rounded-pill px-4 mb-3" href="http://compressjpeg.com/id/" target="_blank">
                                    <i className="fa fa-file-image-o mr-2"></i> Buka Website Compress JPG
                                </Button>
                                <ul className="pl-3 small text-muted">
                                    <li>Unggah berkas JPG Anda.</li>
                                    <li>Klik tombol <strong>Unduh</strong> setelah proses selesai.</li>
                                </ul>
                            </div>
                        </div>

                        <hr className="my-4"/>

                        <div className="d-flex">
                            <div className="instruction-number">3</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Kompresi File Gambar (PNG)</h6>
                                <Button color="success" size="sm" className="rounded-pill px-4 mb-3" href="http://compresspng.com/id/" target="_blank">
                                    <i className="fa fa-file-image-o mr-2"></i> Buka Website Compress PNG
                                </Button>
                                <ul className="pl-3 small text-muted">
                                    <li>Unggah berkas PNG Anda.</li>
                                    <li>Klik tombol <strong>Unduh</strong> setelah proses selesai.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default UkuranBerkas;