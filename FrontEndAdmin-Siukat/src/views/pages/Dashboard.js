import React from 'react'
import {Row, Col, Card, CardBody, CardTitle, CardFooter } from 'reactstrap'
import { SummaryCmahasiswa, DashboardChartMetadata } from '../components';
import { dashboard } from "../../actions"

import { connect } from 'react-redux'
import { cookies, cookieName } from "../../global"

// const brandPrimary = '#20a8d8';
// const brandSuccess = '#4dbd74';
const brandInfo = '#63c2de';
// const brandWarning = '#f8cb00';
// const brandDanger = '#f86c6b';

// convert Hex to RGBA
function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
  
    var result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}

class Dashboards extends React.Component{
    constructor(props){
        super(props);        
        this.state = {
            fields:[],
            startDates:[],
            endDates:[],
            mainChart : {
                labels: props.fields,
                datasets: [
                    {
                        data: props.endDates
                    },
                    {
                        label: 'Mulai Pengisisan',
                        backgroundColor: convertHex(brandInfo, 10),
                        borderColor: brandInfo,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data: props.startDates
                    }
                ]
            },
            mainChartOpts : {
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                    }
                    }],
                    yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                        max: 250
                    }
                    }]
                },
                elements: {
                    point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                    }
                }
            }

        }
    }
    componentWillMount(){                        
        
        this.props.dispatch(dashboard.fetchData(cookies.get(cookieName)));  
    }
    render(){
        return(
            <div>
                <SummaryCmahasiswa/>
                <Row>
                    <Col>
                        <Card>
                            <CardBody className="card-body">
                                <Row>
                                <Col sm="12">
                                    <CardTitle className="mb-0">Traffic Pengisian UKT</CardTitle>
                                    {/* <div className="small text-muted">November 2015 <span>{this.state.hellow}</span></div> */}
                                </Col>
                                {/* <Col sm="7" className="d-none d-sm-inline-block">
                                    <Button color="primary" className="float-right"><i className="icon-cloud-download"></i></Button>
                                    <ButtonToolbar className="float-right" aria-label="Toolbar with button groups">
                                    <ButtonGroup className="mr-3" data-toggle="buttons" aria-label="First group">
                                        <Label htmlFor="option1" className="btn btn-outline-secondary">
                                        <Input type="radio" name="options" id="option1"/> Day
                                        </Label>
                                        <Label htmlFor="option2" className="btn btn-outline-secondary active">
                                        <Input type="radio" name="options" id="option2" defaultChecked/> Month
                                        </Label>
                                        <Label htmlFor="option3" className="btn btn-outline-secondary">
                                        <Input type="radio" name="options" id="option3"/> Year
                                        </Label>
                                    </ButtonGroup>
                                    </ButtonToolbar>
                                </Col> */}
                                </Row>
                                {/* <div className="chart-wrapper" style={{height: 300 + 'px', marginTop: 40 + 'px'}}>
                                    <Line data={this.state.mainChart} redraw options={this.state.mainChartOpts} height={300}/>
                                </div> */}
                            </CardBody>
                            <CardFooter style={{backgroundColor: 'white'}}>
                                <DashboardChartMetadata />
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
    componentDidMount(){   
    }
    componentWillReceiveProps(){
        var obj = this;
        this.setState({
            mainChart : {
                labels: obj.props.fields,
                datasets: [
                    {
                        label: 'Penyelesaian Pengisisan',
                        backgroundColor: convertHex(brandInfo, 10),
                        borderColor: brandInfo,
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data: obj.props.endDates
                    },
                    {
                        label: 'Mulai Pengisisan',
                        backgroundColor: convertHex("#d64a57", 10),
                        borderColor: "#d64a57",
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data: obj.props.startDates
                    }
                ]
            },
            mainChartOpts : {
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                    gridLines: {
                        drawOnChartArea: false,
                    }
                    }],
                    yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        maxTicksLimit: 5,
                        stepSize: Math.ceil(250 / 5),
                        max: 100
                    }
                    }]
                },
                elements: {
                    point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4,
                    hoverBorderWidth: 3,
                    }
                }
            }
        })
    }
}

export default connect((store) => ({
    fields : store.dashboarddata.fields,
    startDates : store.dashboarddata.startDates,
    endDates : store.dashboarddata.endDates
}))(Dashboards)