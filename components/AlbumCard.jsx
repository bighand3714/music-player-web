import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { Avatar } from 'antd'
import Link from 'next/link'

function ArtistCard ({ album }) {
    return (
        <>
        <div className="music-card">
            <div className="poster">
                <img src={album.picUrl} className="album-poster" />
                {/* <Avatar size={140} src={album.picUrl} /> */}
            </div>
            <div className="music-play"></div>
            <div className="album-name">
              <a href={`/albumDetail?id=${album.id}`}>{album.name}</a>
              <div className="album-artist">
                {album.artists[0].name}
              </div>
            </div>
        </div>
        <style jsx>{`
            .album-poster {
                width:100%;
            }
            .poster {
              padding: 20px;
            }
            .music-card {
                width: 180px;
                height: 280px;
                border-radius: 10px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                text-align: center;
                background-color: #222222;
                color: white;
            }​
            .album-name {
              padding: 10px;
            }
            .album-artist {
              color: #999999;
              font-size: 8px;
            }
            a:link {
              color:white;
              font-weight:bold;
            }
            a:visited {
              color:white;
              font-weight:bold;
            }
        `}</style>
        </>
    )
}

export default connect()(withRouter(ArtistCard))