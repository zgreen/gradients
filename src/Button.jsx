import React from 'react'

class Button extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (event) {
    event.preventDefault()
    const args = this.props.shouldUseEvent
      ? [event, ...this.props.callbackArgs]
      : this.props.callbackArgs
    this.props.clickCallback(...args)
  }
  render () {
    return (
      <button onClick={this.handleClick}
        className={this.props.className}><span>{this.props.text}</span></button>
    )
  }
};

Button.propTypes = {
  text: React.PropTypes.string,
  className: React.PropTypes.string,
  clickCallback: React.PropTypes.func,
  callbackArgs: React.PropTypes.array,
  shouldUseEvent: React.PropTypes.bool.isRequired
}

export default Button
