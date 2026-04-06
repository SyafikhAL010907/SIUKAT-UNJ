import React from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';

class UkuranBerkas extends React.Component{
    render(){
        return(
            <Card>
                <CardBody>
                    <CardTitle>Mengubah Ukuran Berkas</CardTitle>
                    Terdapat 3 cara untuk mengubah ukuran berkas:
                    <hr/>
                    <ol>
                        <li>
                            <b>Mengubah Ukuran File PDF:</b>
                            <ol>
                                <li>
                                    Buka website <Button className="btn btn-primary btn-sm" href="http://shrinkpdf.com/id/">Shrink PDF</Button>.
                                </li>
                                <li>
                                    Unggah berkas yang ingin digabungkan.
                                </li>
                                <li>
                                    Tunggu hingga proses pengunggahan selesai.
                                </li>
                                <li>
                                    Klik <b>Unduh</b> atau <b>Unduh Semua</b> (jika file lebih dari 1) untuk mengunduh hasilnya.
                                </li>
                            </ol>
                            <hr/>
                        </li>
                        <li>
                            <b>Mengubah Ukuran File JPG:</b><br/>
                            <ol>
                                <li>
                                    Buka website <Button className="btn btn-primary btn-sm" href="http://compressjpeg.com/id/">Compress JPG</Button>.
                                </li>
                                <li>
                                    Unggah berkas yang ingin digabungkan.
                                </li>
                                <li>
                                    Tunggu hingga proses pengunggahan selesai.
                                </li>
                                <li>
                                Klik <b>Unduh</b> atau <b>Unduh Semua</b> (jika file lebih dari 1) untuk mengunduh hasilnya.
                                </li>
                            </ol>
                            <hr/>
                        </li>
                        <li>
                            <b>Mengubah Ukuran File PNG:</b><br/>
                            <ol>
                                <li>
                                    Buka website <Button className="btn btn-primary btn-sm" href="http://compresspng.com/id/">Compress PNG</Button>.
                                </li>
                                <li>
                                    Unggah berkas yang ingin digabungkan.
                                </li>
                                <li>
                                    Tunggu hingga proses pengunggahan selesai.
                                </li>
                                <li>
                                Klik <b>Unduh</b> atau <b>Unduh Semua</b> (jika file lebih dari 1) untuk mengunduh hasilnya.
                                </li>
                            </ol>
                            <hr/>
                        </li>
                    </ol>
                </CardBody>
            </Card>
        );
    }
}

export default UkuranBerkas;