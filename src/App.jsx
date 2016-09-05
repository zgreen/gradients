import React from 'react'
import ReactDOM from 'react-dom'
import Stop from './Stop';
import * as styles from './styles.css';

const initialStops = [
  { x: window.innerWidth / 2, y: 0, frozen: false, color: '#FF6347' },
  { x: window.innerWidth, y: 0, frozen: true, color: '#FFD700' }
];

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      stops: initialStops,
      colorPickerVisibile: false,
      currentColor: '#FF6347',
      degree: 90,
      menuIsOpen: false,
      stopsAreVisible: true,
      shouldRoundValues: true,
    }
    this.copyGradient = this.copyGradient.bind(this);
    this.clearStops = this.clearStops.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.newStop = this.newStop.bind(this);
    this.freezeStop = this.freezeStop.bind(this);
    this.removeStop = this.removeStop.bind(this);
    this.setBackground = this.setBackground.bind(this);
    this.toggleRoundedValues = this.toggleRoundedValues.bind(this);
    this.throttle = this.throttle.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleStopsVisibility = this.toggleStopsVisibility.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.updateCurrentColor = this.updateCurrentColor.bind(this);
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
    this.setState({ stops: initialStops });
  }
  freezeStop (index) {
    this.state.stops[index].frozen = !this.state.stops[index].frozen;
  }
  mouseMove (event) {
    const stops = this.state.stops;
    if (this.state.stops.filter((stop, idx) => (stop.frozen)).length ===
      this.state.stops.length) {
      return;
    } else {
      this.state.stops.map((stop, idx) => {
        if (!stop.frozen) {
          stops[idx].x = event.clientX;
          stops[idx].y = event.clientY;
        }
      });
      this.setState({ stops });
    }
  }
  removeStop (idx) {
    const stops = this.state.stops;
    if (stops.length >= 2) {
      stops.splice(idx, 1);
      this.setState({ stops });
    }
  }
  setBackground () {
    const percentageStops = this.state.stops.map((stop) => {
      const percentage = (stop.x / window.innerWidth) * 100;
      return `${stop.color} ${this.state.shouldRoundValues ? Math.round(percentage) : percentage}%`;
    });
    return `linear-gradient(${this.state.shouldRoundValues ? Math.round(this.state.degree) : this.state.degree}deg, ${percentageStops.join(', ')})`;
  }
  toggleColorPicker () {
    this.setState({ colorPickerVisibile: !this.state.colorPickerVisibile });
  }
  newStop (event, didAddFromMenu = false) {
    if (this.state.stops.filter((stop, idx) => (stop.frozen)).length ===
      this.state.stops.length) {
      const stops = this.state.stops;
      stops.splice(stops.length - 1, 0, {
        x: didAddFromMenu ? ((window.innerWidth - stops[stops.length - 2].x) / 2) + stops[stops.length - 2].x : event.clientX,
        y: event.clientY,
        frozen: didAddFromMenu,
        color: this.state.currentColor
      });
      this.setState({ stops });
      this.setState({ colorPickerVisibile: false });
    }
  }
  throttle (callback, event) {
    function step() {
      callback(event);
      window.requestAnimationFrame(step)
    }
    step();
  }
  toggleMenu () {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }
  toggleRoundedValues () {
    this.setState({ shouldRoundValues: !this.state.shouldRoundValues });
  }
  toggleStopsVisibility () {
    this.setState({ stopsAreVisible: !this.state.stopsAreVisible });
  }
  updateColor (color) {
    this.setState({ currentColor: color.hex });
  }
  updateCurrentColor (event) {
    const stops = this.state.stops;
    stops[stops.length - 1].color = event.target.value;
    this.setState({ stops });
  }
  updateStopColor (event, idx) {
    const stops = this.state.stops;
    stops[idx].color = event.target.value;
    this.setState({ stops });
  }
  updateDegree (event) {
    if (event.target.value.length) {
      this.setState({ degree: event.target.value })
    } else {
      this.setState({ degree: 90 })
    }
  }
  updateStopPosition(event, idx) {
    const stops = this.state.stops;
    stops[idx].x = (event.target.value * window.innerWidth) / 100;
    this.setState({ stops });
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
            onClick={this.toggleMenu}>{this.state.menuIsOpen ? '\u2190 Close Menu' : '\u2190 Open Menu'}</button>
          <button onClick={(event) => {this.newStop(event, true)}}>New stop</button>
          <form action="">
            <label htmlFor="">Degree</label>
            <input
              onChange={this.updateDegree}
              value={parseInt(this.state.degree)}
              type="number"
            />
          </form>
          <h2>Stops</h2>
          <ol className={styles.stopList}>
            {this.state.stops.map((stop, idx) => (
              <li className={styles.stopItem} key={idx}>
                <form action="">
                  <label htmlFor="">Percentage</label>
                  <input min="0"
                    max="100"
                    value={(stop.x / window.innerWidth) * 100}
                    onChange={(event) => {this.updateStopPosition(event, idx)}}
                    type="number"/>
                  <label htmlFor="">Color</label>
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(event) => {this.updateStopColor(event, idx)}}
                    className={styles.colorInput}
                  />
                </form>
                {idx > 0 && idx < this.state.stops.length - 1 ?
                  <button onClick={this.removeStop.bind(null, idx)}
                    aria-label="Remove stop">X</button> :
                  null
                }
              </li>
            ))}
          </ol>
          <form action="">
            <label htmlFor="">Round all values to nearest integer?</label>
            <input onClick={this.toggleRoundedValues} value={this.state.shouldRoundValues} type="checkbox"/>
          </form>
        </div>
        {this.state.stops.map((stop, idx) => (
          <Stop index={idx}
            key={idx}
            freezeStop={this.freezeStop}
            coords={this.state.stops[idx]}
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

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
