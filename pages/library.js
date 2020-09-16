import axios from 'axios'
import { withRouter } from 'next/router'
import ArtistCard from '../components/ArtistCard'


function Library ({artist, album}) {
  // console.log(album)

  return (
    <div className="root">
      <div className='top-select'> 
        收藏的歌手
      </div>
      <div className='artist-list'>
        {
          artist.data.map(art => {
            return (
              <div className='artist-card'>
                <ArtistCard artist={art} key={art.id} />
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
    </div>
  )
}

Library.getInitialProps = async ({}) => {
  
  const server = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true,
  })
  
  const artists = await server 
    .post('artist/sublist')
    .then(resp => {
      return resp
    })

  return {
    artist: artists.data,
    // album: albums.data,
  }
}

export default withRouter(Library)