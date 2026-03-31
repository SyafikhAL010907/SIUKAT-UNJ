import React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import { info } from '../../actions';

class Bantuan extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.dispatch(info.fetchInfo());
    }
    render() {
        return (
            <Card body color="warning">
                <CardTitle>Bantuan</CardTitle>
                <CardText>
                    <span className="fa fa-envelope-o"></span> cs.pendaftaran@unj.ac.id{' '}
                    <br />
                    <span>
                        <a
                            className="fa fa-telegram"
                            href={this.props.info.kontak}
                            style={{
                                color: '#555',
                                fontStyle: 'bold',
                                fontSize: '18',
                                fontType: 'sans-serif',
                            }}
                        >
                            {' '}
                            @admisiunjofficial
                        </a>
                    </span>{' '}
                    <br />
                    <span>
                        <a
                            className="fa fa-instagram"
                            href={this.props.info.instagram}
                            style={{
                                color: '#555',
                                fontStyle: 'bold',
                                fontSize: '18',
                                fontType: 'sans-serif',
                            }}
                        >
                            {' '}
                            @admisiunj
                        </a>
                    </span>{' '}
                    <br />
                    <span className="fa fa-phone"></span> (021)4788-2394{' '}
                    <br />
                    Hanya melayani pukul 09.00 - 17.00 WIB
                </CardText>
            </Card>
        );
    }
}

export default connect((store) => {
    return {
        info: store.info.info,
    };
})(Bantuan);
