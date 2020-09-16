import { withRouter } from 'next/router'
import { connect } from 'react-redux'
import { Avatar } from 'antd'
import Link from 'next/link'

function ArtistCard ({ artist }) {
    return (
        <>
        <div className="music-card">
            <div className="poster">
                {/* <img src={artist.picUrl} className="album-poster" /> */}
                <Avatar size={140} src={artist.picUrl} />
            </div>
            <div className="music-play"></div>
            <div className="artist-name">
              <a href={`/artistDetail?id=${artist.id}`}>{artist.name}</a>
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
                height: 250px;
                border-radius: 10px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                text-align: center;
                background-color: #222222;
                color: white;
            }​
            .artist-name {
              padding: 10px;

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