import React from 'react';
import * as styles from './styles.css';

export default class Stop extends React.Component {
  constructor (props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    // this.setStyle = this.setStyle.bind(this);
  }
  handleClick () {
    this.props.freezeStop(this.props.index);
  }
  // setStyle () {
  //   let result = this.props.coords.x;
  //   if (this.props.coords.frozen) {
  //     result =
  //   }
  // }
  render () {
    return (
      <span style={{left: this.props.coords.x}}
        className={styles.stop}
        onClick={this.handleClick}>
        <span className={styles.stopCounter}>{this.props.index}</span>
      </span>
    )
  }
}

Stop.propTypes = {
  degree: React.PropTypes.number,
  index: React.PropTypes.number,
  coords: React.PropTypes.object,
  handleClick: React.PropTypes.func
};
