import axios from 'axios'
import { withRouter } from 'next/router'
import AlbumCard from '../components/AlbumCard'


function LibraryAlbum ({artist, album}) {
  console.log(album)

  return (
    <div className="root">
      <div className='top-select'> 
        收藏的专辑
      </div>
      <div className='artist-list'>
        {
          album.data.map(al => {
            return (
              <div className='artist-card'>
                <AlbumCard album={al} key={al.id} />
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

LibraryAlbum.getInitialProps = async ({}) => {
  // const artists = await axios 
  //   .get('http://localhost:4000/artist/sublist')
  //   .then(resp => {
  //     console.log(resp)
  //     return resp
  //   })
  const server = axios.create({
    baseURL: 'http://localhost:4000/',
    withCredentials: true,
  })
  
  const albums = await server 
    .post('album/sublist')
    .then(resp => {
      return resp
    })

  return {
    album: albums.data,
    // album: albums.data,
  }
}

export default withRouter(LibraryAlbum)