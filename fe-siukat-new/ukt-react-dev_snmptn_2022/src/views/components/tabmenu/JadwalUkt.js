import React from 'react';
import { Table } from 'reactstrap';

class JadwalUkt extends React.Component {
    render() {
        return (
            <Table responsive striped bordered className="login-schedule">
                <thead>
                    <tr className="table-head-green">
                        <th width="30%">Kegiatan</th>
                        <th width="70%">Jadwal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Pengisian Data UKT</td>
                        <td>{this.props.info.pengisian}</td>
                    </tr>
                    <tr>
                        <td>Pengumuman UKT</td>
                        <td>{this.props.info.pengumuman}</td>
                    </tr>
                    {/* <tr>
            <td>Proses Klarifikasi UKT</td>
            <td>
              {this.props.info.klarifikasi_tanggal}
              <br />
              {this.props.info.klarifikasi_lokasi}
            </td>
          </tr> */}
                    <tr>
                        <td>Pembayaran UKT</td>
                        <td>{this.props.info.pembayaran}</td>
                    </tr>
                    <tr>
                        <td>Lapor Diri &amp; Registrasi</td>
                        <td>{this.props.info.lapor_diri}</td>
                    </tr>
                </tbody>
            </Table>
        );
    }
}

export default JadwalUkt;
