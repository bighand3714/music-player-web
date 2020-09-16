import axios from 'axios'
import { withRouter } from 'next/router'

import MusicList from '../components/MusicList'

function ArtistDetail({ result }) {
  // console.log(result)
  const img = result.artist.img1v1Url
  const name = result.artist.name

  return (
    <div className="root">
      <div className="artist-img">
        <img src={img}></img>
        <p>{name}</p>
      </div>
      <div className="hot-songs">
        <p>热门歌曲</p>
        <div className="song-list">
          {result.hotSongs.map(song => {
            return (
              <MusicList key={song.id} result={song} />
            )
          })}
        </div>
      </div>
      <style jsx>{`
        {/* .root {
          display: flex;
          flex-wrap: wrap;
        } */}
        .artist-img {
          padding: 50px 50px 50px 50px;
          display: flex;
        }
        .artist-img img {
          width: 200px;
          height: 200px;
        }  
        .artist-img p {
          padding-left: 50px;
          font-size: 50px;
          color: white;
        }
        .hot-songs {
          color: white;
        }
      `}</style>
    </div>
  )
}

ArtistDetail.getInitialProps = async({ router }) => {
  const id = router.query.id

  // /user/playlist?uid=32953014
  const server = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true,
  })
  
  const artists = await server 
    .post(`artists?id=${id}`)
    .then(resp => {
      return resp
    })

  return {
    result: artists.data
  }
}

export default withRouter(ArtistDetail)