import React from 'react'
import ReactDOM from 'react-dom'
import Stop from './Stop';
import { store, connector } from './Store';
import * as styles from './styles.css';

class Main extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      menuIsOpen: false,
      stopsAreVisible: true
    }
    this.copyGradient = this.copyGradient.bind(this);
    this.clearStops = this.clearStops.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.newStop = this.newStop.bind(this);
    this.freezeStop = this.freezeStop.bind(this);
    this.removeStop = this.removeStop.bind(this);
    this.setBackground = this.setBackground.bind(this);
    this.toggleRoundedValues = this.toggleRoundedValues.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleStopsVisibility = this.toggleStopsVisibility.bind(this);
    this.updateDegree = this.updateDegree.bind(this);
    this.updateStopPosition = this.updateStopPosition.bind(this);
  }
  copyGradient (event) {
    if (document.queryCommandSupported('copy')) {
      event.persist();
      const message = document.createElement('p');
      message.className = styles.copiedMessage;
      message.textContent = 'Copied!';
      event.target.select();
      document.execCommand('copy');
      event.target.parentElement.appendChild(message);
      event.target.style.opacity = 0;
      message.style.opacity = 1;
      setTimeout(() => {
        message.style.opacity = 0;
      }, 900);
      setTimeout(() => {
        event.target.parentElement.removeChild(message);
        event.target.style.opacity = 1;
      }, 1000);
    }
  }
  clearStops () {
    return false;
    // this.setState({ stops: initialStops });
  }
  freezeStop (index) {
    const stops = store.getState().stops;
    this.props.setStops(
      stops.map((stop, idx) => {
        if (idx === index) {
          stop.frozen = !stop.frozen;
        }
        return stop;
      }, [])
    );
  }
  mouseMove (event) {
    const stops = store.getState().stops;
    if (stops.filter((stop, idx) => (stop.frozen)).length === stops.length) {
      return;
    } else {
      const result = stops.map((stop) => {
        if (!stop.frozen) {
          stop.x = event.clientX;
          stop.y = event.clientY;
        }
        return stop;
      });
      this.props.setStops(result);
    }
  }
  removeStop (idx) {
    const stops = store.getState().stops;
    if (stops.length >= 2) {
      this.props.setStops(stops.slice(0, idx).concat(stops.slice(idx + 1)));
    }
  }
  setBackground () {
    const percentageStops = store.getState().stops.map((stop) => {
      const percentage = (stop.x / window.innerWidth) * 100;
      return `${stop.color} ${store.getState().shouldRoundValues ? Math.round(percentage) : percentage}%`;
    });
    return `linear-gradient(${store.getState().shouldRoundValues ? Math.round(store.getState().degree) : store.getState().degree}deg, ${percentageStops.join(', ')})`;
  }
  newStop (event, didAddFromMenu = false) {
    if (store.getState().stops.filter((stop, idx) => (stop.frozen)).length ===
      store.getState().stops.length) {
      const stops = store.getState().stops;
      const result = stops
        .slice(0, stops.length - 1)
        .concat(
          {
            x: didAddFromMenu ? ((window.innerWidth - stops[stops.length - 2].x) / 2) + stops[stops.length - 2].x : event.clientX,
            y: event.clientY,
            frozen: didAddFromMenu,
            color: this.state.currentColor
          },
          stops[stops.length - 1]
        )
      this.props.setStops(result);
    }
  }
  toggleMenu () {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }
  toggleRoundedValues () {
    this.props.setRoundValues(!store.getState().shouldRoundValues);
  }
  toggleStopsVisibility () {
    this.setState({ stopsAreVisible: !this.state.stopsAreVisible });
  }
  updateStopColor (event, index) {
    this.props.setStops(store.getState().stops.map((stop, idx) => {
      if (index === idx) {
        stop.color = event.target.value;
      }
      return stop;
    }));
  }
  updateDegree (event) {
    if (event.target.value.length) {
      this.props.setDegree(event.target.value);
    }
  }
  updateStopPosition(event, index) {
    this.props.setStops(store.getState().stops.map((stop, idx) => {
      if (index === idx) {
        stop.x = (event.target.value * window.innerWidth) / 100
      }
      return stop;
    }));
  }
  render () {
    return (
      <div className={styles.app}
        onMouseMove={this.mouseMove}
        onDoubleClick={this.newStop}
        style={{background: this.setBackground()}}>
        <div className={styles.controls} style={{transform: this.state.menuIsOpen ? 'translateX(100%)' : 'translateX(0%)'}}>
          <button
            className={styles.menuToggle}
            onClick={this.toggleMenu}>{this.state.menuIsOpen ? '\u2190 Close Menu' : '\u2192 Open Menu'}</button>
          <button onClick={(event) => {this.newStop(event, true)}}>New stop</button>
          <form action="">
            <label htmlFor="">Degree</label>
            <input
              onChange={this.updateDegree}
              value={parseInt(store.getState().degree)}
              type="number"
            />
          </form>
          <h2>Stops</h2>
          <ol className={styles.stopList}>
            {store.getState().stops.map((stop, idx) => (
              <li className={styles.stopItem} key={idx}>
                <form className={styles.stopMenuItem} action="">
                  <div>
                    <label htmlFor="">Percentage</label>
                    <input min="0"
                      max="100"
                      value={(stop.x / window.innerWidth) * 100}
                      onChange={(event) => {this.updateStopPosition(event, idx)}}
                      type="number"/>
                  </div>
                  <div>
                    <label htmlFor="">Color</label>
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(event) => {this.updateStopColor(event, idx)}}
                      className={styles.colorInput}
                    />
                  </div>
                </form>
                {idx > 0 && idx < store.getState().stops.length - 1 ?
                  <button onClick={this.removeStop.bind(null, idx)}
                    aria-label="Remove stop">X</button> :
                  null
                }
              </li>
            ))}
          </ol>
          <form action="">
            <label htmlFor="">Round all values to nearest integer?</label>
            <input onClick={this.toggleRoundedValues} defaultChecked={store.getState().shouldRoundValues} type="checkbox"/>
          </form>
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
          onMouseMove={(event) => {event.stopPropagation()}}
          onClick={(event) => {event.stopPropagation()}}
          onDoubleClick={(event) => {event.stopPropagation()}}
          className={styles.codeContainer}
        >
          <button className={styles.clearButton}
            onClick={this.clearStops}>Start over</button>
          <input
            className={styles.code}
            onClick={this.copyGradient}
            readOnly
            type="text"
            value={this.setBackground()}
          />
        <button className={styles.toggleStopsButton} onClick={this.toggleStopsVisibility}>{this.state.stopsAreVisible ? 'Hide' : 'Show'} stops</button>
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
};

module.exports = connector(Main);
// export default connector(Main);

if (module.hot) {
  module.hot.accept();
}