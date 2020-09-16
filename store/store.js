import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import axios from 'axios'

const userInitialState = {}
const playListInitialState = {}
const nowListInitialState = {}
const nowPlayInitialState = {}

const LOGOUT = 'LOGOUT'

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT: {
      return {}
    }
    default:
      return state
  }
}

function playListReducer(state = playListInitialState, action) {
  switch (action.type) {
    case LOGOUT: {
      return {}
    }
    default:
      return state
  }
}

function nowListReducer(state = nowListInitialState, action) {
  switch (action.type) {
    default: 
      return state
  }
}

function nowPlayReducer(state = nowPlayInitialState, action) {
  switch (action.type) {
    default: 
      return state
  }
}


const allReducers = combineReducers({
  user: userReducer,
  playList: playListReducer,
  nowList: nowListReducer,
  nowPlay: nowPlayReducer,
})

// action creators
export function logout() {
  return dispatch => {
    axios
      .post('/logout')
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: LOGOUT,
          })
        } else {
          console.log('logout failed', resp)
        }
      })
      .catch(err => {
        console.log('logout failed', err)
      })
  }
}

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    Object.assign(
      {},
      {
        user: userInitialState,
        playList: playListInitialState,
        nowList: nowListInitialState,
        nowPlay: nowPlayInitialState,
      },
      state,
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk)),
  )

  return store
}
