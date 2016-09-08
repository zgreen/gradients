import React from 'react'
import Stop from './Stop'
import Button from './Button'
import Input from './Input'
import { store, connector } from './Store'
import * as styles from './styles.css'

class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      menuIsOpen: false,
      stopsAreVisible: true,
      copiedMessageIsVisible: false
    }
    this.copyGradient = this.copyGradient.bind(this)
    this.clearStops = this.clearStops.bind(this)
    this.mouseMove = this.mouseMove.bind(this)
    this.newStop = this.newStop.bind(this)
    this.freezeStop = this.freezeStop.bind(this)
    this.removeStop = this.removeStop.bind(this)
    this.setBackground = this.setBackground.bind(this)
    this.toggleRoundedValues = this.toggleRoundedValues.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
    this.toggleStopsVisibility = this.toggleStopsVisibility.bind(this)
    this.updateDegree = this.updateDegree.bind(this)
    this.updateStopColor = this.updateStopColor.bind(this)
    this.updateStopPosition = this.updateStopPosition.bind(this)
  }
  copyGradient (event) {
    if (document.queryCommandSupported('copy')) {
      this.setState({ copiedMessageIsVisible: true })
      event.persist()
      event.target.select()
      document.execCommand('copy')
      setTimeout(() => {
        this.setState({ copiedMessageIsVisible: false })
      }, 1000)
    }
  }
  clearStops () {
    this.props.setStops([])
  }
  freezeStop (index) {
    const stops = store.getState().stops
    this.props.setStops(
      stops.map((stop, idx) => {
        if (idx === index) {
          stop.frozen = !stop.frozen
        }
        return stop
      }, [])
    )
  }
  mouseMove (event) {
    const stops = store.getState().stops
    if (stops.filter((stop, idx) => (stop.frozen)).length === stops.length) {
      return
    } else {
      const result = stops.map((stop) => {
        if (!stop.frozen) {
          stop.x = event.clientX
          stop.y = event.clientY
        }
        return stop
      })
      this.props.setStops(result)
    }
  }
  removeStop (idx) {
    const stops = store.getState().stops
    if (stops.length >= 2) {
      this.props.setStops(stops.slice(0, idx).concat(stops.slice(idx + 1)))
    }
  }
  setBackground () {
    const percentageStops = store.getState().stops.map((stop) => {
      const percentage = (stop.x / window.innerWidth) * 100
      return `${stop.color} ${store.getState().shouldRoundValues ? Math.round(percentage) : percentage}%`
    })
    return `linear-gradient(${store.getState().shouldRoundValues ? Math.round(store.getState().degree) : store.getState().degree}deg, ${percentageStops.join(', ')})`
  }
  newStop (event, didAddFromMenu = false) {
    const stops = store.getState().stops
    if (stops.filter((stop, idx) => (stop.frozen)).length === stops.length) {
      const result = stops
        .slice(0, stops.length - 1)
        .concat(
        {
          x: didAddFromMenu ? ((window.innerWidth - stops[stops.length - 2].x) / 2) + stops[stops.length - 2].x : event.clientX,
          y: event.clientY,
          frozen: didAddFromMenu,
          color: stops[stops.length - 1].color
        },
          stops[stops.length - 1]
        )
      this.props.setStops(result)
    }
  }
  toggleMenu () {
    this.setState({ menuIsOpen: !this.state.menuIsOpen })
  }
  toggleRoundedValues () {
    this.props.setRoundValues(!store.getState().shouldRoundValues)
  }
  toggleStopsVisibility () {
    this.setState({ stopsAreVisible: !this.state.stopsAreVisible })
  }
  updateStopColor (event, index) {
    this.props.setStops(store.getState().stops.map((stop, idx) => {
      if (index === idx) {
        stop.color = event.target.value
      }
      return stop
    }))
  }
  updateDegree (event) {
    if (event.target.value.length) {
      this.props.setDegree(event.target.value)
    }
  }
  updateStopPosition (event, index) {
    this.props.setStops(store.getState().stops.map((stop, idx) => {
      if (index === idx) {
        stop.x = (event.target.value * window.innerWidth) / 100
      }
      return stop
    }))
  }
  render () {
    return (
      <div className={styles.app}
        onMouseMove={this.mouseMove}
        onDoubleClick={this.newStop}
        style={{background: this.setBackground()}}>
        <button
          className={this.state.menuIsOpen
            ? `${styles.menuToggle} ${styles.menuToggleOpen}`
            : styles.menuToggle}
          onClick={this.toggleMenu}>{this.state.menuIsOpen ? '\u2190 Close Menu' : '\u2192 Open Menu'}</button>
        <div className={styles.controls}
          style={{transform: this.state.menuIsOpen ? 'translateX(100%)' : 'translateX(0%)'}}
          onDoubleClick={function (event) { event.stopPropagation() }}>
          <Button text={'New stop'}
            clickCallback={this.newStop}
            callbackArgs={[true]}
            className={styles.newStopButton}
            shouldUseEvent
          />
          <form className={styles.degreeForm} action=''>
            <label htmlFor=''><h2 className={styles.menuHeading}>Degree</h2></label>
            <input
              onChange={this.updateDegree}
              value={parseInt(store.getState().degree)}
              type='number'
            />
          </form>
          <h2 className={styles.menuHeading}>Stops</h2>
          <ol className={styles.stopList}>
            {store.getState().stops.map((stop, idx) => (
              <li className={styles.stopItem} key={idx}>
                <form className={styles.stopMenuItem} action=''>
                  <div>
                    <label htmlFor=''>Percentage</label>
                    <Input attrs={{type: 'number'}}
                      numVal={(stop.x / window.innerWidth) * 100}
                      index={idx}
                      clickCallback={this.updateStopPosition}
                    />
                  </div>
                  <div>
                    <label htmlFor=''>Color</label>
                    <Input attrs={{type: 'color'}}
                      stringVal={stop.color}
                      index={idx}
                      clickCallback={this.updateStopColor}
                      className={styles.colorInput}
                    />
                  </div>
                  {idx > 0 && idx < store.getState().stops.length - 1
                    ? <Button className={styles.removeStopButton}
                      clickCallback={this.removeStop}
                      callbackArgs={[idx]}
                      text={'Remove stop'}
                      shouldUseEvent={false} />
                    : null
                  }
                </form>
              </li>
            ))}
          </ol>
          <form className={styles.roundingForm} action=''>
            <label htmlFor=''>Round all values to nearest integer?</label>
            <input onClick={this.toggleRoundedValues}
              defaultChecked={store.getState().shouldRoundValues} type='checkbox' />
          </form>
          <a className={styles.githubLink} href="https://github.com/zgreen/gradients">View On Github</a>
        </div>
        {store.getState().stops.map((stop, idx) => (
          <Stop index={idx}
            key={idx}
            freezeStop={this.freezeStop}
            coords={stop}
            xCoord={stop.x}
            degree={this.state.degree}
            stopsVisible={this.state.stopsAreVisible}
          />
        ))}
        <div
          onMouseMove={function (event) { event.stopPropagation() }}
          onClick={function (event) { event.stopPropagation() }}
          onDoubleClick={function (event) { event.stopPropagation() }}
          className={styles.codeContainer}
        >
          <button className={styles.clearButton}
            onClick={this.clearStops}>Start over</button>
          <input
            className={this.state.copiedMessageIsVisible
              ? `${styles.code} ${styles.hidden}`
              : styles.code
            }
            onClick={this.copyGradient}
            readOnly
            type='text'
            value={this.setBackground()}
          />
          <p
            aria-hidden={!this.state.copiedMessageIsVisible}
            className={(this.state.copiedMessageIsVisible
              ? `${styles.copiedMessage}`
              : `${styles.copiedMessage} ${styles.hidden}`)}>Copied!</p>
          <button className={styles.toggleStopsButton}
            onClick={this.toggleStopsVisibility}>{this.state.stopsAreVisible ? 'Hide' : 'Show'} stops</button>
        </div>
      </div>
    )
  }
}

Main.propTypes = {
  setStops: React.PropTypes.func,
  stops: React.PropTypes.arrayOf(React.PropTypes.object),
  setDegree: React.PropTypes.func,
  setRoundValues: React.PropTypes.func
}

module.exports = connector(Main)

if (module.hot) {
  module.hot.accept()
}
