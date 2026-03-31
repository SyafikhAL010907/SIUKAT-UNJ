import React from 'react';
import { Card, CardBody, CardTitle, Button } from 'reactstrap';

class GabungBerkas extends React.Component{
    render(){
        return(
            <Card>
                <CardBody>
                    <CardTitle>Menggabungkan Hasil Scan</CardTitle>
                    Terdapat 2 cara untuk melakukan penggabungan hasil scan:
                    <hr/>
                    <ol>
                        <li>
                            <b>Melakukan Penggabungan Pada File PDF:</b>
                            <ol>
                                <li>
                                    Buka website <Button className="btn btn-primary btn-sm" href="http://combinepdf.com/id/">Combine PDF</Button>.
                                </li>
                                <li>
                                    Unggah berkas yang ingin digabungkan.
                                </li>
                                <li>
                                    Tunggu hingga proses pengunggahan selesai.
                                </li>
                                <li>
                                    Klik <b>Gabungkan</b> untuk mengunduh hasilnya.
                                </li>
                            </ol>
                            <hr/>
                        </li>
                        <li>
                            <b>Melakukan Penggabungan Pada File JPG:</b><br/>
                            <ol>
                                <li>
                                    Buka website <Button className="btn btn-primary btn-sm" href="http://jpg2pdf.com/id/">Combine JPG to PDF</Button>.
                                </li>
                                <li>
                                    Unggah berkas yang ingin digabungkan.
                                </li>
                                <li>
                                    Tunggu hingga proses pengunggahan selesai.
                                </li>
                                <li>
                                    Klik <b>Tergabung</b> untuk mengunduh hasilnya.
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

export default GabungBerkas;