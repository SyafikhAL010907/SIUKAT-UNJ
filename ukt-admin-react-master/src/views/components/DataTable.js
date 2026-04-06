import React from 'react'
import {Link} from 'react-router-dom'
import {Button, Table, Pagination, PaginationItem, PaginationLink, InputGroup, InputGroupAddon, Input} from 'reactstrap'

class DataTable extends React.Component{
    renderColumns(){
        return Object.entries(this.props.columns).map((data, key) => (
            <th key={key}>{data[1]}</th>
        ))
    }
    renderValues(values){
        return Object.entries(this.props.columns).map((data, key) => {
            if(key !== Object.entries(this.props.columns).length - 1){
                let key = data[0].split(".")
                let val = (key.length > 1) ? values[key[0]][key[1]] : values[data[0]]   // Maks. 2 tingkat :(
                return (
                    <td key={key}>{val}</td>
                )
            }else{
                if(this.props.update !== undefined && this.props.delete !== undefined){
                    return (
                        <td key={key}>
                            <Button color="warning" className="btn-sm" onClick={(e) => this.props.update(e, values[this.props.primaryKey])}><i className="fa fa-pencil"></i> Perbarui</Button>{" "}
                            <Button color="danger" className="btn-sm" onClick={(e) => this.props.delete(e, values[this.props.primaryKey])}><i className="fa fa-close"></i> Hapus</Button>
                        </td>
                    )
                }else{
                    return (
                        <td key={key}>
                            <Link to={"/admin/peserta/" + values[this.props.primaryKey]} className="btn btn-sm btn-warning"><i className="fa fa-eye"></i> Lihat</Link>
                        </td>
                    )
                }
            }
        })
    }
    renderList(){
        return Array.isArray(this.props.data) ? this.props.data.map((data, key) => {
            return (
                <tr key={key}>
                    <td>{key+1}</td>
                    {this.renderValues(data)}
                </tr>
            )
        }) : ""
    }
    renderPagination(){
        let pagination = [],
            currentPage = parseInt(this.props.currentPage, 10),
            totalPages = parseInt(this.props.totalPages, 10),
            prevBool = false, 
            nextBool = false,
            active = false

        // PREV BUTTON
        if(currentPage === 1) prevBool=true
        pagination.push(<PaginationItem key="0" disabled={prevBool}><PaginationLink previous href="" 
                        onClick={(e) => this.props.renderData(e, this.props.perPage, currentPage-1, this.props.keyword)}>Sebelumnya</PaginationLink></PaginationItem>)
        
        // NAV BUTTON
        let start   = (this.props.currentPage===1)?this.props.currentPage:(this.props.currentPage>=4)?this.props.currentPage-3:this.props.currentPage-(this.props.currentPage-1),
            end     = (this.props.totalPages>4)?this.props.currentPage+3:this.props.totalPages
        for(let i = start; i<=end; i++){
            active = (i===currentPage) ? true : false
            pagination.push(<PaginationItem key={i} active={active}><PaginationLink href="" 
                            onClick={(e) => this.props.renderData(e, this.props.perPage, i, this.props.keyword)}>{i}</PaginationLink></PaginationItem>)
        }

        // NEXT BUTTON
        if(totalPages === currentPage) nextBool = true
        pagination.push(<PaginationItem key="999" disabled={nextBool}><PaginationLink next href="" 
                        onClick={(e) => this.props.renderData(e, this.props.perPage, currentPage+1, this.props.keyword)}>Berikutnya</PaginationLink></PaginationItem>)

        return pagination
    }
    render(){
        // console.log(this.props.data)
        return(
            <div>
                <div className="clearfix">
                    <div className="float-left">
                        <InputGroup>
                            <span style={{paddingTop: '7px'}}>Tampilkan</span>
                            <Input type="select" id="perPage" name="perPage" className="margin-side-5" value={this.props.perPage} onChange={this.props.handlePerPage}>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </Input>
                            <span style={{paddingTop: '7px'}}>Per Halaman</span>
                        </InputGroup>
                    </div>
                    <div className="float-right">
                        <InputGroup>
                            <InputGroupAddon addonType="prepend"><i className="fa fa-search"></i></InputGroupAddon>
                            <Input type="text" id="keyword" name="keyword" placeholder="Pencarian" value={this.props.keyword} onChange={this.props.handleSearch}/>
                        </InputGroup>
                    </div>
                </div>
                <Table responsive striped className="margin-top-20">
                    <thead>
                        <tr>
                            <th>No</th>
                            {this.renderColumns()}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderList()}
                    </tbody>
                </Table>
                <div className="clearfix">
                    <div className="float-left">
                        Menampilkan {(this.props.data.length > this.props.perPage) ? this.props.perPage : this.props.data.length} dari total <b>{this.props.total}</b> data
                    </div>
                    <div className="float-right">
                        <Pagination>
                            {this.renderPagination()}
                        </Pagination>
                    </div>
                </div>
            </div>
        )
    }
}

export default DataTable