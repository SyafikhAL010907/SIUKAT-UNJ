import React from 'react'
import {Row, Col, Card, CardHeader, CardBody, Button,
        Modal, ModalBody, ModalFooter, ModalHeader,
        FormGroup, Label, Input} from 'reactstrap'

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import {rekapitulasi} from "../../../actions"
import {cookieName,cookies} from "../../../global"

import {connect} from "react-redux"

import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';


const footerData = [
    [
        {
            label:"Total",
            columnIndex:0,
            align:'right'
        },
        {
            label:"total.total_mahasiswa",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.total_mahasiswa, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:1
        },
        {
            label:"total.I",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.I, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:2
        },
        {
            label:"total.II",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.II, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:3
        },
        {
            label:"total.III",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.III, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:4
        },
        {
            label:"total.IV",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.IV, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:5
        },
        {
            label:"total.V",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.V, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:6
        },
        {
            label:"total.VI",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.VI, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:7
        },
        {
            label:"total.VII",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.VII, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:8
        },
        {
            label:"total.VIII",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.VIII, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:9
        },
        {
            label:"total.bidikmisi",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.bidikmisi, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:10
        },
        {
            label:"total.total_ukt",
            formatter:(data)=>{
                var t = 0
                for(let i of data){
                    t+= parseInt(i.total_ukt, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:11
        },
        {
            label:"total.subtotal",
            formatter:(data)=>{
                console.log(data)
                var t = 0
                for(let i of data){
                    t+= parseInt(i.subtotal, 10)
                }
                return (<strong>{t}</strong>)
            },
            columnIndex:12
        },
    ]
]

class ProgramStudi extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            toggleProgramStudi: false,
            rows:[],
            footerData:[]
        }
        this.toggleProgramStudi = this.toggleProgramStudi.bind(this)
    }
    toggleProgramStudi(){
        this.setState({
            toggleProgramStudi: !this.state.toggleProgramStudi
        })
    }
    componentDidMount(){
        this.props.dispatch(rekapitulasi.fetchDataProdi(cookies.get(cookieName)))
    }
    exportCSV(){
        let rekapTotal = {}
        rekapTotal.fakultas = "Total"
        rekapTotal.total_mahasiswa = 0
        rekapTotal.I = 0
        rekapTotal.II = 0
        rekapTotal.III = 0
        rekapTotal.IV = 0
        rekapTotal.V = 0
        rekapTotal.VI = 0
        rekapTotal.VII = 0
        rekapTotal.VIII = 0
        rekapTotal.bidikmisi = 0
        rekapTotal.total_ukt = 0
        rekapTotal.subtotal = 0
        for(let data of this.props.data.rekapFakultas){
            rekapTotal.total_mahasiswa += data.total_mahasiswa
            rekapTotal.I += data.I
            rekapTotal.II += data.II
            rekapTotal.III += data.III
            rekapTotal.IV += data.IV
            rekapTotal.V += data.V
            rekapTotal.VI += data.VI
            rekapTotal.VII += data.VII
            rekapTotal.VIII += data.VIII
            rekapTotal.bidikmisi += data.bidikmisi
            rekapTotal.total_ukt += data.total_ukt
            rekapTotal.subtotal += data.subtotal
        }
        return [
            ...this.props.data.rekapFakultas,
            rekapTotal
        ]
    }
    componentWillReceiveProps(nextProps){                
    }
    render(){       
        const options = {
            onExportToCSV : this.exportCSV.bind(this)
        } 
        return(
            <Row>
                <Col xs="12">
                    <Card className="card-accent-success">
                        <CardHeader>
                            <span>ProgramStudi</span>
                            <Button className="float-right btn btn-sm btn-success" onClick={this.toggleProgramStudi}></Button>
                        </CardHeader>
                        <CardBody className="card-body">
                            <BootstrapTable data={this.props.data.rekapProdi}  
                                exportCSV={true}
                                search
                                csvFileName="Export-Prodi.csv"
                                options={options}
                                footerData={footerData}
                                footer
                                striped 
                                hover
                                pagination 
                                ignoreSinglePage>
                                <TableHeaderColumn row='0' width='25%' rowSpan='2' isKey dataField='prodi'>Fakultas</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='total_mahasiswa'>Total Mahasiswa</TableHeaderColumn>

                                <TableHeaderColumn row='0' colSpan='8'>Golongan</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='I'>I</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='II'>II</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='III'>III</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='IV'>IV</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='V'>V</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='VI'>VI</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='VII'>VII</TableHeaderColumn>
                                    <TableHeaderColumn row='1' dataField='VIII'>VIII</TableHeaderColumn>

                                <TableHeaderColumn row='0' rowSpan='2' dataField='bidikmisi'>Bidikmisi</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='total_ukt'>Total UKT</TableHeaderColumn>
                                <TableHeaderColumn row='0' rowSpan='2' dataField='subtotal'>Selesai Isi</TableHeaderColumn>                                
                            </BootstrapTable>                               
                        </CardBody>
                    </Card>

                    <Modal isOpen={this.state.toggleProgramStudi} toggle={this.toggleProgramStudi}
                       className={'modal-success ' + this.props.className}>
                    <ModalHeader toggle={this.toggleProgramStudi}>Form ProgramStudi</ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label htmlFor="username">Nama Pengguna</Label>
                            <Input type="text" id="username" name="username" placeholder="Enter your company name"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="password">Kata Sandi</Label>
                            <Input type="text" id="password" name="password" placeholder="DE1234567890"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="no_telepon">Nomor Telepon</Label>
                            <Input type="text" id="no_telepon" name="no_telepon" placeholder="DE1234567890"/>
                        </FormGroup>
                        <FormGroup>
                            <Label htmlFor="role">Role</Label>
                            <Input type="select" name="role" id="role">
                                <option value="developer">Developer</option>
                                <option value="operator">Operator</option>
                                <option value="validator">Validator</option>
                            </Input>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter className="text-right">
                        <Button color="success" onClick={this.toggleProgramStudi}>Simpan</Button>{' '}
                        <Button color="secondary" onClick={this.toggleProgramStudi}>Batal</Button>
                    </ModalFooter>
                    </Modal>
                </Col>
            </Row>
        )
    }
}

export default connect((store)=>({
    data:store.rekapitulasi
}))(ProgramStudi)