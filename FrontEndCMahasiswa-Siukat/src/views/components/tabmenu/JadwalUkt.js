import React from 'react';

class JadwalUkt extends React.Component {
    render() {
        return (
            <table className="premium-table-modern">
                <thead>
                    <tr>
                        <th width="40%">Kegiatan</th>
                        <th width="60%">Jadwal</th>
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
                    <tr>
                        <td>Pembayaran UKT</td>
                        <td>{this.props.info.pembayaran}</td>
                    </tr>
                    <tr>
                        <td>Lapor Diri &amp; Registrasi</td>
                        <td>{this.props.info.lapor_diri}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default JadwalUkt;
