const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')
const MySql = require('mysql')

const koaBody = require('koa-body')
const atob = require('atob')

const api = require('./server/cloud-api')
const login = require('./server/login')
const play = require('./server/play')

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

// 创建Redis Client
const redis = new Redis()

// 设置nodejs全局增加一个atob方法
global.atob = atob

app.prepare().then(() => {
    const server = new Koa()
    const router = new Router()

    server.keys = ['nextWebMusicPlayer']

    server.use(koaBody())

    const SESSION_CONFIG = {
        key: 'jid',
        store: new RedisSessionStore(redis),
    }

    server.use(session(SESSION_CONFIG, server))

    api(server)
    login(server)
    play(server)

    server.use(router.routes())

    server.use(async (ctx, next) => {
        // ctx.cookies.set('id', 'userid:xxxxx')
        ctx.req.session = ctx.session
        await handle(ctx.req, ctx.res)
        ctx.respond = false
    })

    server.use(async (ctx, next) => {
        ctx.res.statusCode = 200
        await next()
    })

    server.listen(3000, () => {
        console.log('koa server listening on 3000')
    })
})