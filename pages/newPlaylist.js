import { useState, useCallback } from 'react'
import axios from 'axios'
import getCofnig from 'next/config'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import { Input, Button } from 'antd'
import { UserOutlined } from '@ant-design/icons'


function NewPlaylist({ router, user }) {
  const urlQuery = router.query && router.query.query
  
  const [add, setAdd] = useState(urlQuery || '')
  const handleAddChange = useCallback(
    event => {
      setAdd(event.target.value)
    },
    [setAdd],
  )

  const handleOnAdd = useCallback(() => {
    // router.push(`/addlist?name=${add}`)

    const server = axios.create({
      baseURL: 'http://localhost:4000/',
      withCredentials: true,
    })
    
    server.get('playlist/create?name=${add}')
      .then(resp => {
        return resp
      }).catch(err => {
        console.log('addlist failed', err)
      })
  }, [add])

  return (
    <div className="root">
      <span>ID</span>
      <Input
        placeholder="输入歌单名称"
      />
      <Button onClick={`/addlist?name=${add}`}>确认</Button>
      <Input.Search 
        placeholder="新歌单名称" 
        value={add}
        onChange={handleAddChange}
        onSearch={handleOnAdd}
      />
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

NewPlaylist.getInitialProps = ({user}) => {
  console.log(user)
}

export default connect(
  function mapState(state) {
    return {
      user: state.user,
    }
  }
)(withRouter(NewPlaylist))