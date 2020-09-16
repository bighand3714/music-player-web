import axios from 'axios'
import { withRouter } from 'next/router'

function Play ({ result }) {
  console.log(result)

  return (
    <div>
      <audio src={result.data[0].url} controls="controls"/>
    </div>
  )
}

Play.getInitialProps = async({ router }) => {
  const id = router.query.id
  const result = await axios
    .get(`http://localhost:4000/song/url?id=${id}`)
    .then( resp => {
      return resp
    })
  
  return {
    result: result.data
  }
}

export default withRouter(Play)