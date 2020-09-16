import { Button } from 'antd'

export default ({ result }) => {
    return (
        <div className="root">
            <div className="repo-left">
                <div className="repo-name"> {result.name} </div>
                <div className="repo-info"> {result.artists[0].name} · {result.album.name} </div>
            </div>
            
            <div className="repo-right">  
                <Button href={`/play?id=${result.id}`}>播放</Button>
            </div>
            <style jsx> {`
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
                float:left;
            }
            .root .repo-right {
                float:right;
            }
            .repo-name {
                color: white;
                font-size: 20px;
            }
            .repo-info {
                color: white;
            }
            `} </style>
        </div>
    )
}