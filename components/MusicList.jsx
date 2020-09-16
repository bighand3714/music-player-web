import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import {
    Menu, 
    Dropdown, 
    Button, 
} from 'antd'

import { 
    EllipsisOutlined,
    CaretRightOutlined,
} from '@ant-design/icons'

function MusicList ({ result, router }) {

    const menu = (
        <Menu>
          <Menu.Item>
            <a href={`/play?id=${result.id}`}>
              收藏到「喜欢」
            </a>
          </Menu.Item>
          <Menu.Item>
            <a href={`/like?id=${result.id}`}>
              下一首播放
            </a>
          </Menu.Item>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
              添加到歌单
            </a>
          </Menu.Item>
          <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
              从歌单中移除
            </a>
          </Menu.Item>
        </Menu>
    );

    return (
        <div className="root">
            <div className="repo-left">
                <div className="repo-name"> {result.name} </div>
                <div className="repo-info"> 
                    <a>{result.ar[0].name} </a>
                     · 
                    <a> {result.al.name}</a> 
                </div>
            </div>
            
            <div className="repo-right">  
                {/* <Button href={`/play?id=${result.id}`}>播放</Button> */}
                {/* <Button href={`/addmusic?op=add&pid=${85137177}&tracks=${result.id}`}>喜爱</Button> */}
                {/* <CaretRightOutlined twoToneColor="#666666"  size={40} src={user.profile.avatarUrl} /> */}
                <Dropdown overlay={menu} placement="bottomRight">
                    <Button type="text"><EllipsisOutlined className="music-dropdown" /></Button>
                </Dropdown>
            </div>
            <style jsx> {`
                a {
                    color: white;
                }
                .root {
                    display: flex;
                    justify-content: space-between;
                    border-radius: 3px;
                    padding: 5px 20px 10px 10px;
                }
                .root:hover {
                    background: #222222;
                }
                .root .repo-left {
                    float: left;
                }
                .root .repo-right {
                    float: right;
                    size: 100px;
                }
                .repo-name {
                    color: white;
                    font-size: 20px;
                }
                .repo-info {
                    color: white;
                }
                .music-dropdown {
                    color: white;
                    size: 40px;
                }
            `} </style>
        </div>
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
)(withRouter(MusicList))
