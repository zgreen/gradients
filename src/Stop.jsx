import React from 'react'
import * as styles from './styles.css'

class Stop extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick () {
    this.props.freezeStop(this.props.index)
  }
  render () {
    return (
      <span style={{left: `${this.props.coords.x}px`, opacity: this.props.stopsVisible ? '1' : '0'}}
        className={styles.stop}
        onClick={this.handleClick}>
        <span className={styles.stopCounter}><span className={styles.stopArrow}>&larr;</span>{this.props.index}<span className={styles.stopArrow}>&rarr;</span></span>
      </span>
    )
  }
};

Stop.propTypes = {
  index: React.PropTypes.number,
  coords: React.PropTypes.object,
  freezeStop: React.PropTypes.func,
  handleClick: React.PropTypes.func,
  stopsVisible: React.PropTypes.bool
}

export default Stop
