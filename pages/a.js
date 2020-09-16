import { withRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

import axios from 'axios'

const Title = styled.h1 `
    color: yellow;
    font-size: 40px;
`

const color = '#113366'

// 异步加载组件
const Comp = dynamic(import('../components/comp'))

function A({ router, name, time }) {
    console.log('name: ', name)
    console.log('time: ', time)
    return (
        <>
            <Title>This is title {time}</Title>
            <Comp />
            <Link href='#aaa'>
                <a className='link'>
                    A {router.query.id} {name}
                </a>
            </Link>
            <style jsx>{`
                a {
                    color: red; 
                }    
                .link {
                    color: ${color};
                }
            `}</style>
        </>
    )
}

// 仅pages下的getInitialProps会被调用，无需等待客户端加载完成
A.getInitialProps = async (ctx) => {
    // 异步加载webpack
    console.log(ctx.router.query)
    const moment = await import('moment')
    console.log('a.js')
    

    const promise = new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: 'jokcy',
                time: moment.default(Date.now() - 60*1000).fromNow()
            })
        }, 100)
    })

    return await promise
}

export default withRouter(A) 