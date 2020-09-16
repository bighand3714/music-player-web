import axios from 'axios'
import { withRouter } from 'next/router'
import { connect } from 'react-redux'

const api = require('../lib/cloud-api')

function Test({ result, test }) {
  console.log(result)
  // console.log('test ', test)

  return (
    <div>
      test
    </div>
  )
}

Test.getInitialProps = async ({ ctx }) => {
  // const test = api.request(
  //   {
  //     url: '/cloud/search/hot'
  //   },
  //   ctx.req,
  //   ctx.res
  // ).catch(err => {
  //   console.log(err)
  // })
  // console.log('hello', test)

  const result = await axios
    .get('http://localhost:4000/search/hot')
    .then(resp => {
      console.log(resp)
      return resp
    })

  return {
    result: result.data,
    // test: test.data,
  }
}

export default withRouter(
  connect(function mapState(state) {
    return {
      user: state.user,
    }
  })(Test),
)