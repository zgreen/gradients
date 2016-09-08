import React from 'react'

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (event) {
    this.props.clickCallback(event, this.props.index)
  }
  render () {
    return (
      <input {...this.props.attrs}
        value={this.props.numVal || this.props.stringVal}
        onChange={this.handleClick}
      />
    )
  }
};

Input.propTypes = {
  index: React.PropTypes.number,
  className: React.PropTypes.string,
  attrs: React.PropTypes.object,
  numVal: React.PropTypes.number,
  stringVal: React.PropTypes.string,
  clickCallback: React.PropTypes.func
}

export default Input
