import React from 'react';
import { Table, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import { withCookies } from 'react-cookie';
import { ukt } from '../../../actions';
import { rupiah, cookies, cookieName } from '../../../global';

class TabelUkt extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(ukt.getByLoggedIn(cookies.get(cookieName)));
    }

    renderUkt() {
        if (this.props.ukt !== undefined) {
            var ukt = {};
            ukt.I = this.props.ukt.I;
            ukt.II = this.props.ukt.II;
            ukt.III = this.props.ukt.III;
            ukt.IV = this.props.ukt.IV;
            ukt.V = this.props.ukt.V;
            ukt.VI = this.props.ukt.VI;
            ukt.VII = this.props.ukt.VII;
            ukt.VIII = this.props.ukt.VIII;
            return Object.entries(ukt).map((data, key) =>
                data[1] === 0 ? null : (
                    <tr key={key}>
                        <td>{data[0]}</td>
                        <td>{rupiah(data[1])}</td>
                    </tr>
                )
            );
        }
    }

    render() {
        return (
            <div>
                <Alert color="success">
                    Uang Kuliah Tunggal (UKT) adalah biaya pendidikan per semester.
                </Alert>
                <Table
                    responsive
                    striped
                    bordered
                    className="login-schedule text-center"
                >
                    <thead>
                        <tr className="table-head-green">
                            <th width="30%" className="text-center">
                                Kelompok UKT
                            </th>
                            <th width="70%" className="text-center">
                                Besar UKT
                            </th>
                        </tr>
                    </thead>
                    <tbody>{this.renderUkt()}</tbody>
                </Table>
                <Alert color="danger">
                    <ul>
                        <li>
                            Kelompok 1 hanya diperuntukkan bagi <b>keluarga sangat miskin</b>,
              dan mendapatkan subsidi dana dari kelompok lainnya.
                        </li>
                        <li>
                            Kelompok 2 hanya diperuntukkan bagi <b>keluarga miskin</b>, dan
              mendapatkan subsidi dana dari kelompok lainnya.
                        </li>
                    </ul>
                </Alert>
            </div>
        );
    }
}

export default connect((store) => {
    return {
        ukt: store.ukt.ukt,
    };
})(withCookies(TabelUkt));
