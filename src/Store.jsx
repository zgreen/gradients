const redux = require('redux')
const reactRedux = require('react-redux')

const SET_STOPS = 'setStops'
const SET_DEGREE = 'setDegree'
const ROUND_VALUES = 'setRoundValues'
const initialState = {
  stops: [
    { x: window.innerWidth / 2, y: 0, frozen: false, color: '#FF6347' },
    { x: window.innerWidth, y: 0, frozen: true, color: '#FFD700' }
  ],
  degree: 90,
  shouldRoundValues: true
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STOPS:
      if (action.value < 2) {
        return Object.assign({}, state, initialState)
      } else {
        return Object.assign({}, state, { stops: action.value })
      }
    case SET_DEGREE:
      return Object.assign({}, state, { degree: state.shouldRoundValues ? Math.round(action.value) : action.value })
    case ROUND_VALUES:
      console.log(action.value)
      return Object.assign({}, state, { shouldRoundValues: action.value })
    default:
      return state
  }
}

const mapStateToProps = (state) => {
  return { stops: state.stops, degree: state.degree }
}
const mapDispatchToProps = (dispatch) => ({
  setStops (stops) {
    dispatch({ type: SET_STOPS, value: stops })
  },
  setDegree (degree) {
    dispatch({ type: SET_DEGREE, value: degree })
  },
  setRoundValues (shouldRoundValues) {
    dispatch({ type: ROUND_VALUES, value: shouldRoundValues })
  }
})

export const store = redux.createStore(reducer, window.devToolsExtension && window.devToolsExtension())
export const connector = reactRedux.connect(mapStateToProps, mapDispatchToProps)
