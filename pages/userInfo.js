import { useState, useCallback } from 'react'
import getCofnig from 'next/config'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import { Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'

function Login({ router, user }) {

  return (
    <div className="root">
      <span>ID</span>
      <Input
        placeholder="输入ID"
      />
      <span>密码</span>
      <Input
        placeholder="输入密码" 
      />
      <Button onClick='/'>确认更改</Button>
      <style jsx>{`
        .root {
          width: 400px;
        }
        span {
          color: white;
        }  
      `}</style>
  </div>
  )
}

Login.getInitialProps = ({user}) => {
  console.log(user)
}

export default connect(
  function mapState(state) {
    return {
      user: state.user,
    }
  }
)(withRouter(Login))