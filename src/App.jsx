import React from 'react'
import ReactDOM from 'react-dom'
import Stop from './Stop';
import Main from './Main';
import { store } from './Store';
import { Provider } from 'react-redux';
import * as styles from './styles.css';

class App extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
