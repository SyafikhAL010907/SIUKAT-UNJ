import React, {Component} from 'react'
import { cmahasiswa } from '../../actions'
import { connect } from 'react-redux'
import { cookies, cookieName } from '../../global'
import { Button } from 'reactstrap'
import { CSVLink, CSVDownload} from 'react-csv'

const columnsHeaders = [
    {label:"Nomor Peserta", key:"no_peserta"},
    {label:"Nama Lengkap", key:"nama_cmahasiswa"},
    {label:"BM", key:"bidik_misi_cmahasiswa"},
    {label:"Fakultas", key:"fakultas.nama"},
    {label:"Program Studi", key:"prodi.nama"},
    {label:"Kelompok UKT", key:"golongan_id"},
    {label:"Status", key:"flag"},
    {label:"UKT Tinggi", key:"ukt_tinggi"},
    {label:"Nominal UKT", key:"ukt.nominal"},
]

class Exports extends Component{
    constructor(props){
        super(props)

        this.handleExport = this.handleExport.bind(this)
        this.handleDownload = this.handleDownload.bind(this)
    }

    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        this.handleDownload(nextProps)
    }

    handleExport(e, perPage, to=1, key=""){
        this.props.dispatch(cmahasiswa.fetchCmahasiswa(cookies.get(cookieName), {perPage: this.props.count, page: 1, keyword: key}))
    }

    handleDownload(props){
        console.log(props)
        return <CSVDownload data={props.cmahasiswa} target="_blank" />
    }

    render(){
        return(
            <Button className="btn btn-sm btn-info text-white margin-left-10 margin-top-10" onClick={(e)=>{this.handleExport(e,this.props.count)}}>
                <i className="fa fa-file-excel-o"></i> Excel {this.props.title}
            </Button>
        )
    }
}

export default connect((store) => ({
    cmahasiswa: store.cmahasiswa.cmahasiswa,
    count: store.cmahasiswa.datatable.count,
    totalPages: store.cmahasiswa.datatable.totalPages,
    currentPage: store.cmahasiswa.datatable.currentPage,
    perPage: store.cmahasiswa.datatable.perPage,
    keyword: store.cmahasiswa.datatable.keyword,
}))(Exports)