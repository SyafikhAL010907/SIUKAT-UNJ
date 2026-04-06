import React from "react"
import {dashboard} from '../../actions'
import { Progress, Table} from 'reactstrap'

import { connect } from 'react-redux'
import { cookies, cookieName } from "../../global";

class ObjectMetaData extends React.Component{
    
    render(){
        return (
            // <div className="row">
                // <li>
                //     <div className="text-muted">{this.props.title}</div>
                //     <strong>{this.props.valueFinished}/{this.props.valuetotal} Selesai</strong>
                //     <Progress className="progress-xs mt-2" color="success" value={this.props.valueFinished/this.props.valuetotal*100}/>
                //     {/* <h5>{(this.props.valueFinished/this.props.valuetotal*100).toFixed(2)}%</h5> */}
                // </li>
            //     <br/>
            // </div>
            <div>
                {/* <span style={{fontSize: 20, fontWeight: "bold"}}>{this.props.title}</span> */}
                {/* <Progress className="mb-3" multi >
                    <Progress striped bar className="progress-lg" barStyle={{height: '20px', fontSize:'50px'}} color="warning" value={(this.props.valuetotal-this.props.valueFilling-this.props.valueFinished)/this.props.valuetotal*100}>{(this.props.valuetotal-this.props.valueFilling-this.props.valueFinished)} ({((this.props.valuetotal-this.props.valueFilling-this.props.valueFinished)/this.props.valuetotal*100).toFixed(2)} %)</Progress>
                    <Progress striped bar className="progress-lg" barStyle={{height: '20px', fontSize:'50px'}} color="default" value={this.props.valueFilling/this.props.valuetotal*100}>{this.props.valueFilling} ({(this.props.valueFilling/this.props.valuetotal*100).toFixed(2)} %)</Progress>
                    <Progress striped bar className="progress-lg" barStyle={{height: '20px', fontSize:'50px'}} color="success" value={this.props.valueFinished/this.props.valuetotal*100}>{this.props.valueFinished} ({(this.props.valueFinished/this.props.valuetotal*100).toFixed(2)} %)</Progress>
                </Progress> */}
                <Table>
                <tbody>
                {/* <thead> */}
                    <tr>
                        <td rowSpan={2} width={"20%"} style={{verticalAlign: "middle",fontSize: 20,fontWeight:"bold"}}>{this.props.title}</td>
                        <td width={"20%"}>Belum Mengisi <Progress striped bar className="progress-sm" color="warning" animated value={(this.props.valuetotal-this.props.valueFilling-this.props.valueFinished)/this.props.valuetotal*100}/></td>
                        <td width={"20%"}>Sedang Mengisi <Progress striped bar className="progress-sm" color="default" animated value={this.props.valueFilling/this.props.valuetotal*100}/></td>
                        <td width={"20%"}>Selesai Isi <Progress striped bar className="progress-sm" color="success" animated value={this.props.valueFinished/this.props.valuetotal*100}/></td>
                        <td width={"20%"}>Total Peserta</td>
                    </tr>
                {/* </thead> */}
                {/* <tbody> */}
                    <tr>
                        {/* <th scope="row">1</th> */}
                        <td><span style={{fontWeight: "bold"}}>{(this.props.valuetotal-this.props.valueFilling-this.props.valueFinished)}</span> ({((this.props.valuetotal-this.props.valueFilling-this.props.valueFinished)/this.props.valuetotal*100).toFixed(2)} %)</td>
                        <td><span style={{fontWeight: "bold"}}>{this.props.valueFilling}</span> ({(this.props.valueFilling/this.props.valuetotal*100).toFixed(2)} %)</td>
                        <td><span style={{fontWeight: "bold"}}>{this.props.valueFinished}</span> ({(this.props.valueFinished/this.props.valuetotal*100).toFixed(2)} %)</td>
                        <td><span style={{fontWeight: "bold"}}>{this.props.valuetotal}</span></td>
                    </tr>
                </tbody>
                </Table>
            </div>
        )
    }
}
class DashboardChartMetadata extends React.Component{
    render(){
        var rows = [];
        var i = 0;
        for(var d of this.props.data){
            rows.push(<ObjectMetaData key={i} title={d.fakultas} valueFinished={d.countSelesai} valueFilling={d.countPengisian} valuetotal={d.countAll}/>)
            i++;
        }
        return (
            <ul>{rows}</ul>
        )
    }
    componentDidMount(){
        this.props.dispatch(dashboard.fetchMeta(cookies.get(cookieName)))        
    }
}

export default connect((store)=>({
    data:store.dashboarddata.meta.data
}))(DashboardChartMetadata)