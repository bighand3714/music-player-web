const axios = require('axios')

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/getList') {
      const id = ctx.query.id
      // http://localhost:4000/playlist/detail?id=${id}
      if (!id) {
        ctx.body = 'id not exist'
        return 
      }
      const server = axios.create({
        baseURL: 'http://localhost:4000/',
        withCredentials: true,
      })
    
      let songs = ''
      const result = await server
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
      
      ctx.session.nowListInfo = music.data
      ctx.redirect(`/detail?id=${id}`)
    } else {
      await next()
    }
  })
  
  server.use(async(ctx, next) => {
    if (ctx.path === '/play') {
      const id = ctx.query.id
      if (!id) {
        ctx.body = 'id not exist'
        return 
      }
      const songUrl = await axios
        .get(`http://localhost:4000/song/url?id=${id}`)
        .then(resp => {
          // console.log(resp)
          return resp
        })

      ctx.session.nowPlayInfo = songUrl.data
      // console.log('session: ', ctx.session.nowListInfo)
      ctx.redirect('/')
    } else {
      await next()
    }
  })
  
  server.use(async(ctx, next) => {
    if (ctx.path === '/addmusic') {
      const op = ctx.query.op
      const pid = ctx.query.pid
      const tracks = ctx.query.tracks

      // if (op = 'add') {
        if (!pid) {
          ctx.body = 'id not exist'
          return 
        }
        const server = axios.create({
          baseURL: 'http://localhost:4000/',
          withCredentials: true,
        })
      
        const result = await server
          .post(`/playlist/tracks?op=add&pid=${pid}&tracks=${tracks}`) 
        
      // }
      ctx.redirect('/')
    } else {
      await next()
    }
  })

  // http://localhost:4000/playlist/create?name=${add}
  server.use(async (ctx, next) => {
    const id = ctx.query.id
    if (ctx.path === '/addlist') {
    const server = axios.create({
      baseURL: 'http://localhost:4000/',
      withCredentials: true,
    })
    
    const result = await server
      .post(`user/playlist?uid=${id}`)
      .then(resp => {
        return resp
      })

    ctx.session.playListInfo = result.data
    
    ctx.redirect('/')
    } else {
      await next()
    }
  })

  server.use(async (ctx, next) => {
    const id = ctx.query.id
    if (ctx.path === '/like') {
      const serve = axios.create({
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
        withCredentials: true,
        xhrFields: {withCredentials: true},
        baseURL: 'http://localhost:4000/',
      })
      
      const result = await serve
        .post(`like?id=${id}`)
        .then(resp => {
          return resp
        })
      
      ctx.redirect('/')
    } else {
      await next()
    }
  })

  // 处理用户登录页面
  server.use(async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method
    const id = ctx.query.id
    if (path === '/prepare-auth') {
        const { url } = ctx.query   // 正式进行GITHUB的OAUTH之前，目前处于的url
        ctx.session.urlBeforeOAuth = url
        // ctx.body = 'ready'
        // console.log('test')
        ctx.redirect(`/play?id=${id}`)
    } else {
        await next()
    }
})

} 