const { requestCloud } = require('../lib/cloud-api')

module.exports = server => {
  server.use(async (ctx, next) => {
    const path = ctx.path
    const method = ctx.method

    if (path.startsWith('/cloud/')) {
      console.log(ctx.request.body)
      const session = ctx.session
      
      const result = await requestCloud(
        method,
        ctx.url.replace('/cloud/', '/'),
        ctx.request.body || {},
        headers,
      )

      ctx.status = result.status
      ctx.body = result.data
    } else {
      await next()
    }
  })
}