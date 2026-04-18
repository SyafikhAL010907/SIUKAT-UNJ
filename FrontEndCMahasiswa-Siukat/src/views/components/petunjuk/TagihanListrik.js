import React from 'react';
import { Card, CardBody, CardTitle, Button, Alert } from 'reactstrap';

class TagihanListrik extends React.Component{
    render(){
        return(
            <Card className="premium-card p-4 p-md-5">
                <CardBody className="p-0">
                    <CardTitle tag="h4" className="mb-4">
                        <i className="fa fa-bolt text-warning mr-3"></i> Memeriksa Tagihan Listrik
                    </CardTitle>
                    <p className="text-muted mb-4">Berikut adalah 3 cara praktis untuk melakukan pengecekan tagihan listrik Anda:</p>
                    
                    <div className="instruction-section">
                        <div className="d-flex mb-4">
                            <div className="instruction-number">1</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Melalui Aplikasi Android</h6>
                                <p className="small text-muted mb-2">Instal Aplikasi <strong>Cek Tagihan & Listrik</strong> atau klik tombol di bawah ini:</p>
                                <Button color="primary" size="sm" className="rounded-pill px-3 mb-2" href="https://play.google.com/store/apps/details?id=com.tagihan.listrik" target="_blank">
                                    <i className="fa fa-play mr-2"></i> Buka Play Store
                                </Button>
                                <ul className="pl-3 mt-2 small text-muted">
                                    <li>Masukkan nomor pelanggan & bulan yang ingin dicek.</li>
                                    <li>Lakukan pengecekan pada <strong>3 bulan terakhir</strong>.</li>
                                    <li>Akumulasi total tagihan dari 3 bulan tersebut.</li>
                                </ul>
                            </div>
                        </div>

                        <hr className="my-4"/>

                        <div className="d-flex mb-4">
                            <div className="instruction-number">2</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Melalui SMS</h6>
                                <p className="small text-muted mb-2">Ketik SMS dengan format berikut:</p>
                                <div className="bg-light p-2 rounded border-dashed text-center font-weight-bold mb-2">
                                    REK (spasi) No_ID_Pelanggan
                                </div>
                                <p className="small text-muted">Kirim ke <strong>8123</strong></p>
                                <Alert color="info" className="p-2 small mb-0 mt-2 border-0 shadow-none">
                                    <i className="fa fa-info-circle mr-2"></i> Tarif Rp. 500 per SMS (Berlaku seluruh operator).
                                </Alert>
                            </div>
                        </div>

                        <hr className="my-4"/>

                        <div className="d-flex">
                            <div className="instruction-number">3</div>
                            <div className="instruction-content pl-3">
                                <h6 className="font-weight-bold text-dark">Melalui Kantor PLN</h6>
                                <p className="small text-muted mb-0">Lakukan pengecekan langsung pada kantor PLN terdekat di wilayah Anda.</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default TagihanListrik;