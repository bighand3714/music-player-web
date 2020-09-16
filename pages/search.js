import axios from 'axios'
import { withRouter } from 'next/router'
import SongCard from '../components/SongCard'

function Search ({ search, multimatch }) {
  console.log(search)
  console.log(multimatch)
  // if (search.song.name == 'undefined') {
  //   return (
  //     <div>搜索</div>
  //   )
  // }
  return (
    <div className="root">
      <div className="song">
        {search.result.songs.map(song => {
          return (<SongCard result={song} key={song.id} />)
        })}
      </div>
      <div className="artist"></div>
      <div className="album"></div>
      <div className="songList"></div>
    </div>
  )
}

Search.getInitialProps = async ({ router }) => {
  const keywords = router.query.keywords
  // console.log('keywords: ', keywords)

  const search = await axios
    .get(`http://localhost:4000/search?keywords=${keywords}`)
    .then(resp => {
      // console.log('resp: ', resp)
      return resp
    })

  const multimatch = await axios
    .get(`http://localhost:4000/search/multimatch?keywords=${keywords}`)
    .then(resp => {
      console.log('resp: ', resp)
      return resp
    })
  
  return {
    search: search.data,
    multimatch: multimatch.data,
  }
}

export default withRouter(Search)