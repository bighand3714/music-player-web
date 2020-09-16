import { useState, useCallback } from 'react'
import getCofnig from 'next/config'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import { Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const axios = require('axios')

function Login({ router }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = useCallback(
    event => {
      setEmail(event.target.value)
      console.log(email)
    },
    [email]
  )

  const handlePasswordChange = useCallback(
    event => {
      setPassword(event.target.value)
    },
    [password]
  )

  const handleLogin = useCallback(()=>{
    const server = axios.create({
      baseURL: `http://localhost:4000`,
      withCredentials: true,
    })

    const login = server
      .post(`/login?email=${email}&password=${password}`)
      .then(resp => {
        return resp
      })
    
    router.push(`/login?email=${email}&password=${password}`)
  })

  return (
    <div>
      <span>ID</span>
      <Input
        placeholder="用户名"
        prefix={ <UserOutlined className="site-form-item-icon" /> }
        onChange={handleEmailChange} 
      />
      <span>密码</span>
      <Input.Password 
        placeholder="输入密码" 
        onChange={handlePasswordChange}
      />
      <Button onClick={handleLogin}>登录</Button>
      <style jsx>{`
        span {
          color: white;
        }  
      `}</style>
  </div>
  )
}

Login.getInitialProps = () => {

}

export default withRouter(Login)