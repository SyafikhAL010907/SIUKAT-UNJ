import React from 'react'
import { Table, Button } from 'reactstrap'
import { files } from '../../../api'

class UnduhBerkas extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            textUnduhWali: "Unduh",
            textUnduhKontrak: "Unduh"
        }
    }
    unduhWali = () => {
        this.setState({
            textUnduhWali: "Sedang mengunduh..."
        })
        files.unduhWali().then((res) => {
            this.setState({
                textUnduhWali: "Unduh"
            })
        }).catch((err) => {
            this.setState({
                textUnduhWali: "Unduh"
            })
        })
    }
    unduhKontrak = () => {
        this.setState({
            textUnduhKontrak: "Sedang mengunduh..."
        })
        files.unduhKontrak().then((res) => {
            this.setState({
                textUnduhKontrak: "Unduh"
            })
        }).catch((err) => {
            this.setState({
                textUnduhKontrak: "Unduh"
            })
        })
    }
    render(){
        return(
            <Table responsive striped bordered className="login-schedule">
                <thead>
                    <tr className="table-head-green">
                        <th width="5%" className="text-center">No.</th>
                        <th width="70%" className="text-center">Nama Berkas</th>
                        <th width="25%" className="text-center">Unduh</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="text-center">1</td>
                        <td>Surat pernyataan komitmen pembiayaan wali (jika mempunyai Wali)</td>
                        <td className="text-center"><Button className="btn btn-primary btn-sm" onClick={this.unduhWali.bind(this)}><i className="fa fa-download"></i> {this.state.textUnduhWali}</Button></td>
                    </tr>
                    <tr>
                        <td className="text-center">2</td>
                        <td>Surat perjanjian kontrak (jika rumah mengontrak)</td>
                        <td className="text-center"><Button className="btn btn-primary btn-sm" onClick={this.unduhKontrak.bind(this)}><i className="fa fa-download"></i> {this.state.textUnduhKontrak}</Button></td>                                                        
                    </tr>
                    <tr>
                        <td className="text-center">3</td>
                        <td><b>Jika tidak bersedia di UKT Kelompok Atas:</b><br/>Surat pernyataan kebenaran data dengan tanda tangan 2 Tetangga serta RT dan RW</td>
                        <td className="text-center">Surat ini dapat diunduh pada tab VERIFIKASI <b>setelah mengisi data</b></td>
                    </tr>
                    <tr>
                        <td className="text-center">4</td>
                        <td><b>Jika bersedia di UKT Kelompok Atas:</b><br/>Surat pernyataan bersedia ditetapkan di UKT Kelompok Atas</td>
                        <td className="text-center">Surat ini dapat diunduh pada tab SURAT PERNYATAAN <b>saat mengisi data</b></td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default UnduhBerkas