import React from 'react'
import ReactDOM from 'react-dom'
import Stop from './Stop';
import * as styles from './styles.css';
// import { MaterialPicker, SketchPicker } from 'react-color';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      stops: [ { x: window.innerWidth / 2, y: 0, frozen: false, color: '#FF6347' } ],
      colorPickerVisibile: false,
      currentColor: '#FF6347',
      isUpdatingDegreeDial: false,
      degree: 90,
      menuIsOpen: false,
    }
    this.clearStops = this.clearStops.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.newStop = this.newStop.bind(this);
    this.freezeStop = this.freezeStop.bind(this);
    this.setBackground = this.setBackground.bind(this);
    this.toggleColorPicker = this.toggleColorPicker.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.updateColor = this.updateColor.bind(this);
    this.updateCurrentColor = this.updateCurrentColor.bind(this);
    this.updateDegree = this.updateDegree.bind(this);
    this.updateStopPosition = this.updateStopPosition.bind(this);
  }
  clearStops () {
    this.setState({ stops: [{ x: 0, y: 0, frozen: false, color: '#FF6347' }] });
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
  setBackground () {
    const percentageStops = this.state.stops.map((stop) => {
      return `${stop.color} ${(stop.x / window.innerWidth) * 100}%`;
    });
    return `linear-gradient(${this.state.degree}deg, ${percentageStops.join(',')}, gold 100%)`;
  }
  toggleColorPicker () {
    this.setState({ colorPickerVisibile: !this.state.colorPickerVisibile });
  }
  newStop (event, didAddFromMenu) {
    if (this.state.stops.filter((stop, idx) => (stop.frozen)).length ===
      this.state.stops.length) {
      const stops = this.state.stops;
      stops.push({
        x: didAddFromMenu ? ((window.innerWidth - stops[stops.length - 1].x) / 2) + stops[stops.length - 1].x : event.clientX,
        y: event.clientY,
        frozen: false,
        color: this.state.currentColor
      });
      this.setState({ stops });
      this.setState({ colorPickerVisibile: false });
    }
  }
  toggleMenu () {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
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
          <label htmlFor="">Degree</label>
          <input onChange={this.updateDegree} type="number"/>
          <ol className={styles.stopList}>
            {this.state.stops.map((stop, idx) => (
              <li key={idx}>
                <form action="">
                  <label htmlFor="">Stop</label>
                  <input min="0"
                    max="100"
                    value={(stop.x / window.innerWidth) * 100}
                    onChange={(event) => {this.updateStopPosition(event, idx)}}
                    type="number"/>
                  <label htmlFor="">Color</label>
                  <input type="color" value={stop.color} onChange={(event) => {this.updateStopColor(event, idx)}}/>
                </form>
              </li>
            ))}
          </ol>
          <button className={styles.clearButton} onClick={this.clearStops}>Start over</button>
        </div>
        {this.state.stops.map((stop, idx) => (
          <Stop index={idx}
            key={idx}
            freezeStop={this.freezeStop}
            coords={this.state.stops[idx]}
            degree={this.state.degree}
          />
        ))}
        <code className={styles.code}>{this.setBackground()}</code>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
