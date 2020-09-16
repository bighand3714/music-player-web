const axios = require('axios')

const cloud_music_api_url = 'http://localhost:4000'

async function requestCloud(method, url, data, headers) {
  return await axios({
    method,
    url: `${cloud_music_api_url}${url}`,
    data,
    headers,
  })
}

const isServer = typeof window === 'undefined'
async function request({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('url must provide')
  }
  // if (isServer) {
  //   const session = req.session
  //   const githubAuth = session.githubAuth || {}
  //   const headers = {}
  //   if (githubAuth.access_token) {
  //     headers['Authorization'] = `${githubAuth.token_type} ${
  //       githubAuth.access_token
  //     }`
  //   }
  //   console.log(method,url,data,headers)
  //   return await requestCloud(method, url, data, headers)
  // } else {
    // /search/respos
    return await axios({
      method,
      url: `/cloud${url}`,
      data,
    })
  // }
}

module.exports = {
  requestCloud,
  request,
}