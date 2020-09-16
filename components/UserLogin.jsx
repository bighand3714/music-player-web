import { Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'

function UserLogin () {
  return (
    <div className='root'>
      <span>ID</span>
      <Input
        placeholder="输入管理员ID"
        prefix={ <UserOutlined className="site-form-item-icon" /> } 
      />
      <span>密码</span>
      <Input.Password placeholder="输入密码" /><br/>
      <Button href='/userLogin'>登录</Button>
    </div>
  )
}

export default UserLogin