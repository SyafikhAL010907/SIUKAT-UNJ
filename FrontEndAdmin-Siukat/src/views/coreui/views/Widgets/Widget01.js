import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Card, CardBody, Progress} from "reactstrap";
import classNames from 'classnames';
import {mapToCssModules} from 'reactstrap/lib/utils';

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  smallText: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  variant: PropTypes.string
};

const defaultProps = {
  header: '89.9%',
  mainText: 'Lorem ipsum...',
  smallText: 'Lorem ipsum dolor sit amet enim.',
  // color: '',
  value: "25",
  variant: ""
};

class Widget01 extends Component {
  render() {
    const {icon, className, cssModule, header, mainText, smallText, color, value, children, variant, ...attributes} = this.props;

    // demo purposes only
    const progress = {style: "", color: color, value: value};
    const card = {style: "", bgColor: ""};

    if (variant === "inverse") {
      progress.style = "progress-white";
      progress.color = "";
      card.style = "text-white";
      card.bgColor = 'bg-' + color;
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);
    progress.style = classNames("progress-xs my-1", progress.style);

    return (
      <Card className={ classes } {...attributes}>
        <CardBody className="card-body">
          <i className={"fa "+icon+" bg-"+color+" p-3 font-2xl mr-3 float-left"}></i>
          <div className="h4 m-0">{ header }</div>
          <div>{ mainText }</div>
          <Progress className={ progress.style } color={ progress.color } value={ progress.value }/>
          <span className="text-small text-muted">{ smallText }</span>
          <div>{children}</div>
        </CardBody>
      </Card>
    )
  }
}

Widget01.propTypes = propTypes;
Widget01.defaultProps = defaultProps;

export default Widget01;