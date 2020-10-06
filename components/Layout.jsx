import { useState, useCallback, useEffect, setState } from 'react'
import axios from 'axios'
import getCofnig from 'next/config'
import { connect } from 'react-redux'
import Router, { withRouter } from 'next/router'
import Link from 'next/link'

import {
    Button,
    Layout,
    Icon,
    Input,
    Avatar,
    Tooltip,
    Dropdown,
    Menu,
    Tabs,
} from 'antd'

import {
    UserOutlined,
    HeartOutlined,
    BarsOutlined,
    CaretLeftOutlined,
    CaretRightOutlined,
    PlayCircleOutlined
} from '@ant-design/icons'

import Container from './Container'
import AudioPlay from './AudioPlay'

import { cacheArray } from '../lib/repo-basic-cache'

import { logout } from '../store/store'
import AddPlay from './AddPlay'

const { Header, Content, Footer, Sider } = Layout

let cachedPlayList

const isServer = typeof window === 'undefined'

function MyLayout({ children, user, playList, nowList, nowPlay, router }) {
    const urlQuery = router.query && router.query.query

    const [search, setSearch] = useState(urlQuery || '')
    const [add, setAdd] = useState(urlQuery || '')

    const handleSearchChange = useCallback(
        event => {
            setSearch(event.target.value)
        },
        [setSearch],
    )

    const handleOnSearch = useCallback(() => {
        router.push(`/search?keywords=${search}`)
    }, [search])

    const handleAddChange = useCallback(
        event => {
            setAdd(event.target.value)
        },
        [setAdd],
    )

    const handleOnAdd = useCallback(() => {
        // router.push(`/addlist?name=${add}`)
        const server = axios.create({
            baseURL: 'http://localhost:4000/',
            withCredentials: true,
        })

        server.get(`playlist/create?name=${add}`)
            .then(resp => {
                return resp
            }).catch(err => {
                console.log('addlist failed', err)
            })

        router.push(`/addlist?id=${user.account.id}`)
    }, [add])

    const tabKey = router.query.key || '1'

    const userDropDown = (
        <Menu>
            <Menu.Item>
                <a href='/userInfo' >个人信息</a>
            </Menu.Item>
        </Menu>
    )

    const handleTabChange = activeKey => {
        Router.push(`/?key=${activeKey}`)
    }

    useEffect(() => {
        if (!isServer) {
            cachedPlayList = playList
        }
    }, [playList])

    useEffect(() => {
        if (!isServer) {
            cacheArray(playList)
        }
    })

    // 删除指定音乐
    const onDeleteMusic = id => {
        const { musicList } = this.state;
        const newMusicList = [];
        musicList.forEach(item => {
            if (item.id !== id) {
                newMusicList.push(item);
            }
        });
        setState({ musicList: newMusicList });
    };
    // 删除全部音乐
    const onDeleteAllMusic = () => {
        this.setState({ musicList: [] });
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <Input placeholder="default size" prefix={<UserOutlined />}>test</Input>
            </Menu.Item>
        </Menu>
    );

    return (
        <Layout>
            <Layout>
                <Sider width={230}>
                    <div className="logo">
                        <Link href="/">
                            <img src="../spotify-logo.jpg" width="230" height="80" />
                        </Link>
                    </div>
                    <div className="sider-inner">
                        <div className="sider-menulist">
                            <Link href="/index">
                                <a>首  页</a>
                            </Link><br />
                            <Link href="/libraryAlbum">
                                <a>专  辑</a>
                            </Link><br />
                            <Link href="/library">
                                <a>歌  手</a>
                            </Link><br /><br /><br /><br />
                        </div>
                        <div className="sider-playlist">
                            <Link href="/newPlaylist">
                                <a>创建新歌单</a>
                            </Link>
                            <Input.Search
                                enterButton="添加"
                                placeholder="新歌单名称"
                                value={add}
                                onChange={handleAddChange}
                                onSearch={handleOnAdd}
                            />
                        </div>
                        <div className="sider-songlist">
                            {user && user.code ? (
                                <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
                                    <Tabs.TabPane tab="我的歌单" key="1">
                                        {playList.playlist.map(repo => {
                                            if (repo.creator.userId == user.account.id) {
                                                return (
                                                    <a
                                                        href={`/getList?id=${repo.id}`}
                                                        key={repo.id}
                                                    >
                                                        {repo.name}<br />
                                                    </a>
                                                )
                                            }
                                        })}
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab="你关注的歌单" key="2">
                                        {playList.playlist.map(repo => {
                                            if (repo.creator.userId != user.account.id) {
                                                return (
                                                    <a key={repo.id}>{repo.name}<br /></a>
                                                )
                                            }
                                        })}
                                    </Tabs.TabPane>
                                </Tabs>
                            ) : (
                                    <a href="/cloudMusicLogin">登录</a>
                                )}
                        </div>
                    </div>
                </Sider>
                <Layout>
                    <Header>
                        <Container renderer={<div className="header-inner" />}>
                            <div className="header-left">

                                <div>
                                    <Input.Search
                                        placeholder="搜索音乐"
                                        value={search}
                                        onChange={handleSearchChange}
                                        onSearch={handleOnSearch}
                                    />
                                </div>
                            </div>
                            <div className="header-right">
                                <div className="user">
                                    {user && user.code ? (
                                        <Dropdown overlay={userDropDown}>
                                            <a href="/">
                                                <Avatar size={40} src={user.profile.avatarUrl} />
                                            </a>
                                        </Dropdown>
                                    ) : (
                                            <Tooltip title="点击进行登录">
                                                <a href="/cloudMusicLogin">
                                                    <Avatar size={40} icon={<UserOutlined />} />
                                                </a>
                                            </Tooltip>
                                        )}
                                </div>
                            </div>
                        </Container>
                    </Header>
                    <Content className="content">
                        {children}
                    </Content>
                </Layout>
            </Layout>
            <Footer>
                {/* <MusicPlay nowList={nowList} nowPlay={nowPlay} /> */}
                {nowList.songs && nowPlay.data ? (
                    <AudioPlay
                        musicList={nowList.songs}
                        nowPlay={nowPlay.data[0]}
                        onDeleteMusic={onDeleteMusic}
                        onDeleteAllMusic={onDeleteAllMusic}
                    />
                ) : (
                        <div className="dontLogin">Need Login</div>
                    )}

            </Footer>
            <style jsx>{`
                a {
                    text-align: center;
                }
                a:link {
                    color:white;
                }
                a:visited {
                    color:white;
                }
                a:hover {
                    background: #222222;
                }
                .header-inner {
                    background: #111111;
                    display: flex;
                    justify-content: space-between;
                }    
                .header-left {
                    display: flex;
                    justify-content: flex-start;
                }
                .header-right {
                    display: flex;
                    justify-content: flex-start;
                }

                .sider-inner {
                    float: left;
                    border:1px solid black;
                    margin-left:20px;
                }
                .sider-menulist {}
                .sider-playlist {}
                .sider-playlist span {
                    color: white;
                }
                .sider-songlist {}
            `}</style>
            <style jsx global>{`
                #__next {
                    height: 100%;
                }    
                .ant-layout {
                    min-height: 100%;
                    background: #111111;
                }
                .ant-layout-header {
                    background: #111111;
                    padding-left: 0;
                    padding-right: 0;
                }

                .ant-layout-footer {
                    background: #222222;
                    padding: 30px 50px 30px 50px;
                }
                .ant-layout-content.content {
                    background: #111111;
                }
                .ant-layout-sider-children {
                    background: black;
                }
            `}</style>
        </Layout>
    )
}

export default connect(
    function mapState(state) {
        return {
            user: state.user,
            playList: state.playList,
            nowList: state.nowList,
            nowPlay: state.nowPlay,
        }
    },
)(withRouter(MyLayout))
