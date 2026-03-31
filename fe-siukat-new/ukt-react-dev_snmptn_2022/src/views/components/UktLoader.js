import React from 'react';

class UktLoader extends React.Component {
    render() {
        return (
            <div className="loader">
                <div className="group">
                    <div className="bigSqr">
                        <div className="square first"></div>
                        <div className="square second"></div>
                        <div className="square third"></div>
                        <div className="square fourth"></div>
                    </div>
                    <div className="text">
            Mohon Bersabar.
                        <h4 style={{ marginTop: '15px' }}>
                            <span role="img" aria-label="greeting">
                🙏{' '}
                            </span>
                            <span role="img" aria-label="smile">
                😊{' '}
                            </span>
                            <span role="img" aria-label="greeting">
                🙏{' '}
                            </span>
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

export default UktLoader;
