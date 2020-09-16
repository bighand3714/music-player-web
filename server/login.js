const axios = require('axios')

const config = require('../config')
const { request_token_url } = config.cloud

module.exports = server => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/login') {
      const email = ctx.query.email
      const password = ctx.query.password
      // console.log(ctx.query)

      const url = request_token_url + `?email=${email}&password=${password}`

      const result = await axios({
        method: 'POST',
        url: url,
        data: {
          email,
          password,
        },
        headers: {
          Accept: 'application/json',
        },
      })

      // console.log(result.status, result.data)

      if (result.status === 200 && (result.data && !result.data.error)) {
        // ctx.session.cloudLogin = result.data

        // const { access_token, token_type } = result.data

        // const userInfoResp = await axios({
        //   method: 'GET',
        //   url: `http://localhost:4000/login?email=${email}&password=${password}`,
        //   headers: {
        //     Authorization: `${token_type} ${access_token}`,
        //     // Accept: 'application/json',
        //   },
        // })
        const playListInfoResp = await axios({
          method: 'GET',
          url: `http://localhost:4000/user/playlist?uid=${result.data.account.id}`
        })

        // console.log(result.data.account.id)
        ctx.session.userInfo = result.data
        ctx.session.playListInfo = playListInfoResp.data

        ctx.redirect('/')
      } else {
        const errorMsg = result.data && result.data.error
        ctx.body = `request token failed ${errorMsg}`
      }
    } else {
      await next()
    }
  })
}