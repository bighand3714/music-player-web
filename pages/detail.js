import { withRouter } from 'next/router'

import axios from 'axios'

import { useEffect } from 'react'

import { Row, Col, Button, List, Pagination } from 'antd'

import MusicCard from '../components/MusicCard'
import MusicList from '../components/MusicList'

import { cacheArray } from '../lib/repo-basic-cache'

function Detail ({ playlist, songs }) {
  console.log('playlist: ', playlist)
  console.log(songs)
  
  useEffect(() => {
    cacheArray(playlist.songs)
  })

  return (
    <div className="root">
      <Row>
        <Col span={6}>
          <div className="ablum-poster">
            <MusicCard result={playlist} />
          </div>
        </Col>
        <Col span={18}>
          <div className="repos-title">
            <span> 歌单名称： </span><br/>
            <p> {playlist.playlist.name} </p>
            <Button href={`/play?id=${playlist.playlist.id}`}>播放</Button>
          </div>
        </Col>
      </Row>
      <div className="music-list">
        <h3 className="repos-title"> {playlist.playlist.trackCount} 首歌 </h3>
        {songs.songs.map(song => {
          return (
            <MusicList result={song} key={song.id} ListId={playlist.playlist.id} />
          )
        })}
      </div>
      <style jsx>{`
        .root {
          padding: 20px 0;
        }
        .ablum-poster {
          margin: 0px 40px 0px 40px;
        }
        .music-list {
          height: 80px;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          color: white;
          font-size: 24px;
          line-height: 50px;
        }
        .list-info {
          display: flex;
          margin: 0px 30px 0px 30px;
        }
        .repos-title span {
          font-size: 12px;
        }
        .pagination {
          padding: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  )
}

Detail.getInitialProps = async({ router }) => {
  const id = router.query.id
  
  const server = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true,
  })

  let songs = ''
  const playlist = await server
    .get(`playlist/detail?id=${id}`)
    .then(resp => {
      // console.log(resp)
      resp.data.playlist.trackIds.map(song => {
        songs += `${song.id},`
      })
      return resp
    })
    
  const music = await server
    .get(`song/detail?ids=${songs.substr(0,songs.length-1)}`)
    .then(resp => {
      return resp
    })

  return {
    playlist: playlist.data,
    songs: music.data,
    // songs: songs,
  }
}

export default withRouter(Detail)