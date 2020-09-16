import { Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'

function UserLogin () {
  return (
    <div className='root'>
      Login
    </div>
  )
}

UserLogin.getInitialProps = async() => {
  // /user/playlist?uid=32953014
  
  // const server = axios.create({
  //   baseURL: 'http://localhost:4000/',
  //   withCredentials: true,
  // })
  
  // const playlist = await server 
  //   .post('top/playlist')
  //   .then(resp => {
  //     return resp
  //   })

  // return {
  //   result: playlist.data
  // }
}

export default UserLogin