import axios from 'axios'
import PlaylistCard from '../components/PlaylistCard'

function Index({ result }) {
  // console.log(result)
    
  return (
    <div className="root">
      <div className='top-select'> 
        热门歌单
      </div>
      <div className='artist-list'>
        {
          result.playlists.map(al => {
            return (
              <div className='artist-card'>
                <PlaylistCard playlist={al} key={al.id} />
              </div>
            )
          })
        }
      </div>
      <style jsx>{`
        .root {
          width: 100%;
        }
        .top-select {
          font-size: 50px;
          padding-bottom: 20px;
          padding-left: 20px;
          color: white;
        }
        .artist-list {
          display: flex;
          flex-wrap: wrap;
        }
        .artist-card {
          padding: 5px 10px 5px 10px;
        }
      `}</style>
      <style jsx global>{`
        /* 
        滚动条的设置
        ::-webkit-scrollbar 滚动条整体部分，可以设置宽度啥的
        ::-webkit-scrollbar-button 滚动条两端的按钮
        ::-webkit-scrollbar-track  外层轨道
        ::-webkit-scrollbar-track-piece  内层滚动槽
        ::-webkit-scrollbar-thumb 滚动的滑块
        ::-webkit-scrollbar-corner 边角
        ::-webkit-resizer 定义右下角拖动块的样式
        */
        
        /* ::-webkit-scrollbar {
            width: 15px;
            background: #111111;
        }

        ::-webkit-scrollbar-thumb {
            background-color: #666666;
        } */
      `}</style>
    </div>
  )
}

Index.getInitialProps = async() => {
  // /user/playlist?uid=32953014
  
  const server = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true,
  })
  
  const playlist = await server 
    .post('top/playlist')
    .then(resp => {
      return resp
    })

  return {
    result: playlist.data
  }
}

export default Index