import React from 'react'
import createStore from '../store/store'

const isServer = typeof window === 'undefined'
const __NEXT_REUDX_STORE__ = '__NEXT_REUDX_STORE__'

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState)
  }

  if (!window[__NEXT_REUDX_STORE__]) {
    window[__NEXT_REUDX_STORE__] = createStore(initialState)
  }
  return window[__NEXT_REUDX_STORE__]
}

export default Comp => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      // const name = name + '123'

      const { Component, pageProps, ...rest } = this.props

      // console.log(Component, pageProps)

      if (pageProps) {
        pageProps.test = '123'
      }

      return (
        <Comp
          Component={Component}
          pageProps={pageProps}
          {...rest}
          reduxStore={this.reduxStore}
        />
      )
    }
  }

  WithReduxApp.getInitialProps = async ctx => {
    let reduxStore

    if (isServer) {
      const { req } = ctx.ctx
      const session = req.session

      if (session && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo,
          playList: session.playListInfo,
        })
      } else {
        reduxStore = getOrCreateStore()
      }

      if (session && session.nowListInfo && session.userInfo) {
        // session.nowListInfo
        // console.log('session.now: ', session.nowListInfo)
        reduxStore = getOrCreateStore({
          user: session.userInfo,
          playList: session.playListInfo,
          nowList: session.nowListInfo
        })
      }

      if (session && session.nowPlayInfo &&  session.nowListInfo && session.userInfo) {
        reduxStore = getOrCreateStore({
          user: session.userInfo,
          playList: session.playListInfo,
          nowList: session.nowListInfo,
          nowPlay: session.nowPlayInfo,
        })
      }

    } else {
      reduxStore = getOrCreateStore()
    }

    // console.log('reduxStore: ', reduxStore)

    ctx.reduxStore = reduxStore

    let appProps = {}
    if (typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    }
  }

  return WithReduxApp
}
