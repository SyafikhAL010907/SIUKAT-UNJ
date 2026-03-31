import React from 'react';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import { info } from '../../actions';

class JadwalKlarifikasi extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(info.fetchInfo());
    }
    render() {
        return (
            <div>
                <Table bordered responsive>
                    <thead>
                        <tr>
                            <th width="30%" style={{ verticalAlign: 'middle' }}>Tempat :</th>
                            <td>{this.props.info.klarifikasi_lokasi}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Tanggal dan Waktu :</th>
                            <td>{this.props.info.klarifikasi_tanggal} (09.00 - 12.00 WIB &amp; 13.30 - 15.30 WIB)</td>
                        </tr>
                    </tbody>
                </Table>
                <ul className="list-reset">
                    <li>Setelah melakukan wawancara dan memperbaiki data, calon mahasiswa akan mendapat hasil UKT baru yang tidak bisa diverifikasi kembali, dan diharuskan menerima keputusan UKT.</li>
                    <li>Proses selesai, calon mahasiswa dapat melakukan pembayaran saat jadwal pembayaran dimulai.</li>
                </ul>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        info: store.info.info,
    };
})(JadwalKlarifikasi);