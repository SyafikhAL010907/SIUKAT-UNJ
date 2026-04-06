import React from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';

class TagihanListrik extends React.Component{
    render(){
        return(
            <Card>
                <CardBody>
                    <CardTitle>Memeriksa Tagihan Listrik</CardTitle>
                    Terdapat 3 cara untuk melakukan pengecekan tagihan listrik:
                    <hr/>
                    <ol>
                        <li>
                            <b>Melakukan Pengecekan via aplikasi Android:</b>
                            <ol>
                                <li>
                                    Instal Aplikasi Cek Tagihan &amp; Listrik pada Appstore/Playstore atau Klik link <Button className="btn btn-primary btn-sm" href="https://play.google.com/store/apps/details?id=com.tagihan.listrik">Disini</Button>.
                                </li>
                                <li>
                                    Masukan nomor pelanggan serta bulan yang ingin dicek.
                                </li>
                                <li>
                                    Lakukan pengecekan pada 3 bulan terakhir.
                                </li>
                                <li>
                                    Akumulasi total tagihan pada 3 bulan terakhir tersebut.
                                </li>
                            </ol>
                            <hr/>
                        </li>
                        <li>
                            <b>Melakukan Pengecekan via SMS:</b><br/>
                            <ol>
                                <li>Buka menu SMS pada Handphone</li>
                                <li>Ketik SMS dengan format : <b>REK</b> (spasi) <b>No_ID_Pelanggan</b> kirim ke <b>8123</b></li>
                                    Biaya cek tagihan dengan SMS di atas memakan biaya <b>Rp. 500</b> setiap SMS-nya, dan tarif berlaku seluruh operator.
                            </ol>
                            <hr/>
                        </li>
                        <li>
                            <b>Melakukan Pengecekan pada kantor PLN terdekat</b>
                        </li>
                    </ol>
                </CardBody>
            </Card>
        );
    }
}

export default TagihanListrik;