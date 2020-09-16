import { withRouter } from 'next/router'
import { connect } from 'react-redux'

function MusicCard ({ result }) {
    return (
        <>
        <div className="music-card">
            <div className="poster">
                <img src={result.playlist.coverImgUrl} className="album-poster" />
            </div>
            <div className="music-play"></div>
            {/* <div className="name">
                    {result.playlist.name} 
            </div> */}
        </div>
        <style jsx>{`
            .album-poster {
                width:100%;
            }
            .music-card {
                width: 250px;
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
                text-align: center;
                background-color: #4CAF50;
            }​
            .poster span {
                width: 100%;
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                font-size: 40px;
            }​
            .name {
                color: white;
                padding: 10px;
            }
        `}</style>
        </>
    )
}

export default connect(
    function mapState (state) {
        return {
            playList: state.playList,
        }
    }
)(withRouter(MusicCard))