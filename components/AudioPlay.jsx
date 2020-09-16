import React, { Component } from "react"
import _ from "lodash"

import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  HeartOutlined,
  ShareAltOutlined,
  SoundOutlined,
  BarsOutlined,
  CloseOutlined,
  DeleteOutlined,
  FolderAddOutlined,
  LinkOutlined,
  DownloadOutlined,
} from '@ant-design/icons'

import {
  PandaIcon,
  CircuListIcon,
  CircuRandomIcon,
  CircuSingleIcon,
} from './Icon'

// import "./AudioPlay.css";
// import "./style.css";

/**
 * 前端音乐播放器
 * create by willghy
 * @class AudioPlay
 * @extends {Component}
 */
class AudioPlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 是否暂停状态
      isPause: false,
      // 当前音乐列表
      musicList: props.musicList || [],
      // 当前音乐
      currentMusic: props.musicList ? props.musicList[0] : {},
      // 当前音乐URL
      currentMucicUrl: props.nowPlay.url,
      // 总时间
      totalTime: "00:00",
      // 当前播放时间
      currentTime: "00:00",
      // 进度条item是否可拖动
      processItemMove: false,
      // 进度条item是否可拖动
      volumeProcessItemMove: false,
      // 音量控制显示
      volumeControl: false,
      // 当前的播放模式 1列表循环 2随机 3单曲
      playMode: 1,
      // 歌单显示控制
      isMusicListShow: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { currentMusic, musicList: prevMusicList } = prevState;
    const { musicList = [] } = nextProps;
    // 判断音乐列表已经不同了
    if (!_.isEqual(musicList, prevMusicList)) {
      const oldIndex = prevMusicList.findIndex(item => {
        return currentMusic.id === item.id;
      });
      const hasCurrentMusic = musicList.findIndex(item => {
        return currentMusic.id === item.id;
      });
      let newCurrentMusic = musicList[oldIndex]
        ? musicList[oldIndex]
        : musicList[0];
      if (musicList.length === 0) {
        newCurrentMusic = currentMusic;
      }
      return {
        musicList,
        currentMusic: hasCurrentMusic === -1 ? newCurrentMusic : currentMusic
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 当前音乐更新了
    if (prevState.currentMusic.id !== this.state.currentMusic.id) {
      this.resetProcess();
      if (this.state.isPause) {
        this.onPlay();
      }
    }
  }

  componentDidMount() {
    const audio = this.audio;
    // 这里需要设置audio的canplay事件监听
    audio.addEventListener("canplay", () => {
      //获取总时间
      const totalTime = parseInt(audio.duration);
      this.setState({
        totalTime: this.getTime(totalTime)
      });
    });
    // 播放中添加时间变化监听
    audio.addEventListener("timeupdate", () => {
      const { processItemMove } = this.state;
      //获取当前播放时间
      const currentTime = parseInt(audio.currentTime);
      // 缓存对象
      const buffered = audio.buffered;
      // 当前缓存时间
      let bufferTime = 0;
      if (buffered.length !== 0) {
        bufferTime = buffered.end(buffered.length - 1);
      }
      // 当前缓存缓存宽度计算 500是进度条宽度
      const bufferWidth = 500 * (bufferTime / audio.duration);
      // 当前播放宽度计算 500是进度条宽度
      const playWidth = 500 * (audio.currentTime / audio.duration);
      // 如果正在拖动进度条的时候，不监听播放进度
      if (!processItemMove) {
        this.processPlayed.style.width = `${playWidth}px`;
        this.processItem.style.left = `${playWidth - 4}px`;
        // 未拖动时根据时间变化设置当前时间
        this.setState({
          currentTime: this.getTime(currentTime)
        });
      }
      this.processBuffered.style.width = `${bufferWidth}px`;
    });

    // 当前音乐播放完毕监听
    audio.addEventListener("ended", () => {
      this.endedPlayMusic();
    });
    // 初始化音量
    this.initVolumeProcess();
  }

  // 秒转换-分:秒的格式
  getTime = time => {
    if (time) {
      const minute = parseInt((time / 60) % 60);
      const second = parseInt(time % 60);
      let minuteText = `${minute}`;
      let secondText = `${second}`;
      if (minute < 10) {
        minuteText = `0${minute}`;
      }
      if (second < 10) {
        secondText = `0${second}`;
      }
      return `${minuteText}:${secondText}`;
    } else {
      return "00:00";
    }
  };

  // 播放
  onPlay = () => {
    const audio = this.audio;
    this.setState({ isPause: true });
    audio.play();
  };

  // 暂停
  onPause = () => {
    const audio = this.audio;
    this.setState({ isPause: false });
    audio.pause();
  };

  // 点击进度条
  onProcessClick = e => {
    this.setProcess(e, "click");
  };

  // 设置进度条进度
  setProcess = (e, key) => {
    // 获取当前点击偏移宽度
    let offsetWidth = e.pageX - this.processPlayed.getBoundingClientRect().left;
    // 需要限制拖动范围，不能超出左右边界
    if (offsetWidth < 0) {
      offsetWidth = 0;
    }
    if (offsetWidth > this.process.offsetWidth) {
      offsetWidth = this.process.offsetWidth;
    }
    // 计算偏移比例
    const offsetPercentage = offsetWidth / this.process.offsetWidth;
    // 计算当前时间
    const currentTime = this.audio.duration * offsetPercentage;
    if (key === "click" || key === "dragMove") {
      // 设置当前进度条偏移位置
      this.processPlayed.style.width = `${offsetWidth}px`;
      this.processItem.style.left = `${offsetWidth - 4}px`;
      this.setState({ currentTime: this.getTime(currentTime) });
    }
    // 设置当前音乐进度 拖拽不需要及时计算播放进度，会导致音乐像快进一样的效果，体验很差，点击进度条是需要及时设置当前播放进度的
    if (key === "dragEnd" || key === "click") {
      // this.audio.currentTime = currentTime;
    }
  };

  //  进度条item MouseDown
  onProcessItemMouseDown = e => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 按下后置item为可拖动状态
    this.setState({ processItemMove: true });
  };
  //  进度条item MouseMove
  onProcessItemMouseMove = e => {
    // 阻止事件冒泡
    e.stopPropagation();
    const { processItemMove } = this.state;
    if (processItemMove) {
      this.setProcess(e, "dragMove");
    }
  };
  //  进度条item MouseUp
  onProcessItemMouseUp = e => {
    const { processItemMove } = this.state;
    // 阻止事件冒泡
    e.stopPropagation();
    // 这里的判断是关键，一定要判断是处于processItemMove=true的状态，表示当前正在拖动进度条，不然会导致mouseUp和onClick事件的传播问题
    if (processItemMove) {
      this.setState({ processItemMove: false });
      // 松开后置item为禁止拖动的状态
      this.setProcess(e, "dragEnd");
    }
  };

  // 当前音乐播放结束后下一首音乐处理 根据当前的播放模式决定下一首音乐是什么
  endedPlayMusic = () => {
    const { playMode, currentMusic } = this.state;
    const { musicList } = this.state;
    if (musicList.length > 0 && currentMusic) {
      const currentIndex = musicList.findIndex(item => {
        return item.id === currentMusic.id;
      });
      // 列表循环
      if (playMode === 1) {
        if (musicList[currentIndex + 1]) {
          this.setState({ currentMusic: musicList[currentIndex + 1] }, () => {
            this.onSwitchAction();
          });
        } else {
          this.setState({ currentMusic: musicList[0] }, () => {
            this.onSwitchAction();
          });
        }
      }
      // 列表随机
      else if (playMode === 2) {
        const randomIndex = Math.floor(Math.random() * 3 + 1);
        if (musicList[randomIndex + 1]) {
          this.setState({ currentMusic: musicList[randomIndex + 1] }, () => {
            this.onSwitchAction();
          });
        } else {
          this.setState({ currentMusic: musicList[0] }, () => {
            this.onSwitchAction();
          });
        }
      }
      // 单曲循环
      else if (playMode === 3) {
        this.onSwitchAction();
      }
    } else {
      // 当前播放列表已经空了，则不自动切歌，播放完毕后，直接重置当前的播放的音乐
      this.onSwitchAction();
    }
  };

  // 下一首歌
  nextMusic = () => {
    console.log(this.audio)
    const { currentMusic } = this.state;
    const { musicList } = this.state;
    if (musicList.length > 1 && currentMusic) {
      const currentIndex = musicList.findIndex(item => {
        return item.id === currentMusic.id;
      });
      if (musicList[currentIndex + 1]) {
        this.setState({ currentMusic: musicList[currentIndex + 1] }, () => {
          this.onSwitchAction();
        });
      } else {
        this.setState({ currentMusic: musicList[0] }, () => {
          this.onSwitchAction();
        });
      }
    } else {
      this.audio.currentTime = 0;
      this.onSwitchAction();
    }
  };
  // 上一首歌
  previousMusic = () => {
    const { currentMusic } = this.state;
    const { musicList } = this.state;
    if (musicList.length > 1 && currentMusic) {
      const currentIndex = musicList.findIndex(item => {
        return item.id === currentMusic.id;
      });
      if (musicList[currentIndex - 1]) {
        this.setState({ currentMusic: musicList[currentIndex - 1] }, () => {
          this.onSwitchAction();
        });
      } else {
        this.setState({ currentMusic: musicList[musicList.length - 1] }, () => {
          this.onSwitchAction();
        });
      }
    } else {
      this.audio.currentTime = 0;
      this.onSwitchAction();
    }
  };

  // 切歌后相关操作，如果正在播放中，则切歌后还是会直接播放，如果处于暂停，则切歌后不会直接播放
  onSwitchAction = () => {
    const { isPause } = this.state;
    // 处于暂停标志，则表示正在播放中，则重置进度条后，直接调用播放，否则就只重置进度条，不调用播放
    this.resetProcess();
    if (isPause) {
      this.onPlay();
    }
  };

  // 重新设置当前缓存和播放进度状态，用于切歌后的进度条显示
  resetProcess = () => {
    this.processPlayed.style.width = "0px";
    this.processItem.style.left = "-4px";
  };

  // 音量控制条显示隐藏
  onVolumeControl = () => {
    const { volumeControl } = this.state;
    this.setState({ volumeControl: !volumeControl });
  };

  // 隐藏音量设置条
  onVolumeControlHide = () => {
    const { volumeControl } = this.state;
    if (volumeControl) {
      this.setState({ volumeControl: false });
    }
  };
  // 初始化音量
  initVolumeProcess = () => {
    // 获取当前音量条高度
    const processLength = this.volumeProcess.offsetHeight;
    // 设置进度条
    this.volumeProcessCurrent.style.height = `${processLength / 2}px`;
    // 设置进度条item
    this.volumeProcessItem.style.bottom = `${processLength / 2 - 6}px`;
    // 设置音量
    this.audio.volume = 0.5;
  };

  // 音量控制条点击
  onVolumeProcessSet = e => {
    // 获取当前音量条高度
    const processLength = this.volumeProcess.offsetHeight;
    // 获取当前点击偏移量
    let volumeOffsetHeight =
      processLength -
      (e.pageY - this.volumeProcess.getBoundingClientRect().top);
    // 当前音量进度比例
    let volumepercentage = 0;
    if (volumeOffsetHeight < 0) {
      volumeOffsetHeight = 0;
    }
    if (volumeOffsetHeight > processLength) {
      volumeOffsetHeight = processLength;
    }
    volumepercentage = volumeOffsetHeight / processLength;
    // 设置进度条
    this.volumeProcessCurrent.style.height = `${volumeOffsetHeight}px`;
    // 设置进度条item
    this.volumeProcessItem.style.bottom = `${volumeOffsetHeight - 6}px`;
    // 设置音量
    this.audio.volume = volumepercentage;
  };

  // 音量item鼠标按下方法监听
  onVolumeProcessItemMouseDown = () => {
    // 设置当前进入可拖动状态
    this.setState({ volumeProcessItemMove: true });
  };

  // 音量item鼠标抬起方法监听
  onVolumeProcessItemMouseUp = e => {
    const { volumeProcessItemMove } = this.state;
    if (volumeProcessItemMove) {
      this.setState({ volumeProcessItemMove: false });
    }
  };

  // 音量item鼠标拖拽方法监听
  onVolumeProcessItemMove = e => {
    const { volumeProcessItemMove } = this.state;
    if (volumeProcessItemMove) {
      this.onVolumeProcessSet(e);
    }
  };

  // 设置音乐播放模式
  onPlayModeChange = () => {
    const { playMode } = this.state;
    if (playMode === 3) {
      this.setState({ playMode: 1 });
    } else {
      this.setState({ playMode: playMode + 1 });
    }
  };

  // TODO: 分享
  onShare = () => {
    alert("分享方法，自定义完善");
  };
  // TODO: 分享
  onFolder = () => {
    alert("加入歌单方法，自定义完善");
  };
  // 歌单列表控制
  onMusicList = () => {
    const { isMusicListShow } = this.state;
    this.setState({ isMusicListShow: !isMusicListShow });
  };

  // TODO: 收藏
  onCollect = () => {
    alert("收藏方法，自定义完善");
  };

  // TODO: 单首歌加入收藏歌单
  onAddFile = (e, item) => {
    e.stopPropagation();
    alert(
      `单首歌加入收藏歌单，自定义完善，歌曲id:${item.id}，歌曲名称:${
        item.title
      }`
    );
  };

  // TODO: 分享指定歌曲
  onShareMusic = (e, item) => {
    e.stopPropagation();
    alert(
      `分享指定歌曲，自定义完善，歌曲id:${item.id}，歌曲名称:${item.title}`
    );
  };

  // TODO: 下载指定歌曲
  onUploadMusic = (e, item) => {
    e.stopPropagation();
    alert(
      `下载指定歌曲，自定义完善，歌曲id:${item.id}，歌曲名称:${item.title}`
    );
  };

  // 删除指定歌曲
  onDeleteMusic = (e, item) => {
    e.stopPropagation();
    const { onDeleteMusic } = this.props;
    if (onDeleteMusic) {
      onDeleteMusic(item.id);
    }
  };

  // 删除当前全部歌曲
  onDeleteAllMusic = () => {
    const { onDeleteAllMusic } = this.props;
    if (onDeleteAllMusic) {
      onDeleteAllMusic();
    }
  };

  // 歌单切歌
  onMusicListItemClick = id => {
    const { musicList } = this.state;
    const { currentMusic } = this.state;
    const index = musicList.findIndex(item => {
      return item.id === id;
    });
    if (index !== -1) {
      // 当前播放的音乐和点击的音乐相同，则重置播放时间
      if (currentMusic.id === id) {
        this.resetProcess();
        this.audio.currentTime = 0;
        this.onPlay();
      } else {
        this.setState({ currentMusic: musicList[index] }, () => {
          this.resetProcess();
          this.onPlay();
        });
      }
    }
  };

  render() {
    const {
      currentMusic,
      isPause,
      totalTime,
      currentTime,
      volumeControl,
      playMode,
      isMusicListShow,
      currentMucicUrl,
    } = this.state;
    // const { title, info, img, resource, id } = currentMusic || {};
    const title = currentMusic.name || {}
    const info = currentMusic.ar[0].name || {}
    const img = currentMusic.al.picUrl || {}
    const id = currentMusic.id || {}
    const resource = `https://music.163.com/song/media/outer/url?id=${id}.mp3` 

    const { musicList } = this.state;
    let playModeIcon = "";
    let playIcon
  // CircuListIcon,
  // CircuRandomIcon,
  // CircuSingleIcon,
    switch (playMode) {
      case 1:
        playModeIcon = "icon-circulation-list";
        break;
      case 2:
        playModeIcon = "icon-circulation-random";
        break;
      case 3:
        playModeIcon = "icon-circulation-single";
        break;
      default:
        playModeIcon = "icon-circulation-list";
        break;
    }
    switch (playMode) {
      case 1: 
        playIcon = () => <span><CircuListIcon/></span> 
        break;
      case 2:
        playIcon = () => <span><CircuRandomIcon/></span>
        break;
      case 3:
        playIcon = () => <span><CircuSingleIcon/></span>
        break
      default:
        playIcon = () => <span><CircuListIcon/></span>
        break
    }
    return (
      <div className="mainLayout">
        <div
          className="mainContent"
          onMouseMove={this.onProcessItemMouseMove}
          onMouseUp={this.onProcessItemMouseUp}
        >
          <div className="playContent">
            {/* 左侧控制器，播放，上一首，下一首 */}
            <div className="left-controler">
              <span
                className="icon-prev prev-next-icon"
                onClick={this.previousMusic}
              ><StepBackwardOutlined /></span>
              {isPause ? (
                <span className="icon-pause playIcon" onClick={this.onPause}><PauseCircleOutlined /></span>
              ) : (
                <span className="icon-play playIcon" onClick={this.onPlay}><PlayCircleOutlined /></span>
              )}
              <span
                className="icon-next prev-next-icon"
                onClick={this.nextMusic}
              ><StepForwardOutlined /></span>
            </div>
            {/* 主播放界面，缩略图，作者信息，进度条等 */}
            <div className="main-controler">
              <img src={img} alt="" className="thumbnail" />
              <div className="music-control">
                <div className="music-info">
                  <span className="title-info">{title}</span>
                  <span className="author-info">{info}</span>
                </div>
                <div className="process-time">
                  <div
                    className="process-wrapper"
                    onClick={this.onProcessClick}
                    ref={ref => (this.process = ref)}
                  >
                    <div className="process">
                      <div
                        className="progress-buffered"
                        ref={ref => (this.processBuffered = ref)}
                      />
                      <div
                        className="progress-played"
                        ref={ref => (this.processPlayed = ref)}
                      >
                        <div
                          className="process-item"
                          ref={ref => (this.processItem = ref)}
                          onMouseDown={this.onProcessItemMouseDown}
                          // onMouseUp={this.onProcessItemMouseUp}
                        >
                          <div className="process-item-inside" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="time">
                    <span className="current-time">{currentTime}</span>/
                    <span className="total-time">{totalTime}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* 右侧加入歌单和分享 */}
            <div className="right-folder">
              <span className="folder" onClick={this.onFolder}><HeartOutlined /></span>
              <span className="share" onClick={this.onShare} ><ShareAltOutlined /></span>
            </div>
            {/* 右侧音量调节，循环调节，歌单查看 */}
            <div className="right-controler">
              {/* 音量控制条，这里采用的是style控制，因为需要获取到音量条的ref，如果不存在这个节点，就获取不到ref*/}
              <div
                className="volume-controler"
                style={{ visibility: volumeControl ? "visible" : "hidden" }}
                onMouseMove={this.onVolumeProcessItemMove}
                onMouseUp={this.onVolumeProcessItemMouseUp}
              >
                <div
                  className="volume-process"
                  onClick={this.onVolumeProcessSet}
                  ref={ref => (this.volumeProcess = ref)}
                >
                  <div
                    className="volume-current"
                    ref={ref => (this.volumeProcessCurrent = ref)}
                  >
                    <div
                      className="volume-item"
                      ref={ref => (this.volumeProcessItem = ref)}
                      onMouseDown={this.onVolumeProcessItemMouseDown}
                      onMouseUp={this.onVolumeProcessItemMouseUp}
                    >
                      <div className="volume-item-inside" />
                    </div>
                  </div>
                </div>
              </div>
              <span
                className="volume"
                onClick={this.onVolumeControl}
              ><SoundOutlined /></span>
              {/* {`${playModeIcon} circulation`} */}
              <span
                className="circulation"
                onClick={this.onPlayModeChange}
              >{playMode ? (
                <PandaIcon/>
              ) : (
                <CircuListIcon/>
              )}</span>
              <span className="list" onClick={this.onMusicList} ><BarsOutlined /></span>
            </div>
            {/* 歌单组件 */}
            {isMusicListShow && (
              <div className="musicList">
                <div className="music-list-head">
                  <h4 className="music-list-head-title">
                    播放列表(
                    <span>
                      {musicList && musicList.length ? musicList.length : 0}
                    </span>
                    )
                  </h4>
                  <span
                    className="music-list-head-collect"
                    onClick={this.onCollect}
                  >
                    <span className="music-list-common-icon" ><FolderAddOutlined /></span>
                    <span className="music-list-common-text">收藏全部</span>
                  </span>
                  <span className="music-list-head-line" />
                  <span
                    className="music-list-head-clear"
                    onClick={this.onDeleteAllMusic}
                  >
                    <span className="music-list-common-icon" ><DeleteOutlined /></span>
                    <span className="music-list-common-text">清除全部</span>
                  </span>
                  <p className="music-list-head-name">{title}</p>
                  <span className="music-list-head-close">
                    <span
                      className="music-list-common-icon"
                      onClick={this.onMusicList}
                    ><CloseOutlined /></span>
                  </span>
                </div>
                <div className="music-list-body">
                  <div className="music-list-body-content">
                    <ul className="music-list-body-ul">
                      {musicList &&
                        musicList.length > 0 &&
                        musicList.map(item => {
                          return (
                            <li
                              className={`music-list-li ${id === item.id &&
                                "music-current"}`}
                              onClick={() => this.onMusicListItemClick(item.id)}
                              key={item.id}
                            >
                              <div className="col music-list-li-col-1">
                                {id === item.id && (
                                  <span className="play-triangle-icon icon-currentPlay" />
                                )}
                              </div>
                              <div className="col music-list-li-col-2">
                                <span className="music-list-li-text">
                                  {item.name}
                                </span>
                              </div>
                              <div className="col music-list-li-col-3">
                                <span
                                  className="music-list-action-icon"
                                  onClick={e => this.onAddFile(e, item)}
                                ><FolderAddOutlined /></span>
                                <span
                                  className="music-list-action-icon"
                                  onClick={e => this.onShareMusic(e, item)}
                                ><ShareAltOutlined /></span>
                                <span
                                  className="music-list-action-icon"
                                  onClick={e => this.onUploadMusic(e, item)}
                                ><DownloadOutlined /></span>
                                <span
                                  className="music-list-action-icon"
                                  onClick={e => this.onDeleteMusic(e, item)}
                                ><DeleteOutlined /></span>
                              </div>
                              <div className="col music-list-li-col-4">
                                <span className="music-list-li-text">
                                  {item.ar[0].name}
                                </span>
                              </div>
                              <div className="col music-list-li-col-5">
                                <span className="music-list-li-text">
                                  {item.dt}
                                </span>
                              </div>
                              <div className="col music-list-li-col-6">
                                <span className="music-list-action-icon" ><LinkOutlined /></span>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  <div className="music-list-body-lyric">
                    这里是歌词区域，后期完善
                  </div>
                </div>
              </div>
            )}
            {/* 播放器基础组件 */}
            <audio src={resource} ref={ref => (this.audio = ref)} />
          </div>
        </div>
        <style jsx>{`
          body,
          div,
          dl,
          dt,
          dd,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          ol,
          ul,
          p,
          span,
          a,
          form,
          input,
          textarea,
          section,
          article,
          button,
          table {
            padding: 0;
            margin: 0;
          }

          /* 主布局*/

          .mainLayout {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 0;
            width: 100%;
            z-index: 10;
            zoom: 1;
          }

          /* 主内容展示*/

          .mainContent {
            height: 52px;
            width: 100%;
            position: absolute;
            left: 0;
            top: -52px;
            margin: 0 auto;
            background-color: #333;
          }

          /* 播放主内容布局*/

          .playContent {
            width: 1000px;
            margin: 0 auto;
            position: relative;
            top: 8px;
            height: 44px;
            /* padding: 6px 0 0 0; */
            /* top: 6px; */
          }

          /* 控制器布局*/

          .left-controler {
            display: inline-block;
            margin-right: 25px;
            vertical-align: middle;
          }

          .left-controler span {
            vertical-align: middle;
          }

          /* 主播放暂停icon*/

          .playIcon {
            font-size: 36px;
            cursor: pointer;
            margin-right: 8px;
            opacity: 0.8;
            color: #fff;
          }

          .playIcon:hover {
            opacity: 1;
          }

          .prev-next-icon {
            font-size: 28px;
            cursor: pointer;
            margin-right: 8px;
            opacity: 0.8;
            color: #fff;
          }

          /* 切换icon-上一首-下一首*/

          .prev-next-icon:hover {
            opacity: 1;
          }

          /*主控制器*/

          .main-controler {
            display: inline-block;
            font-size: 12px;
            vertical-align: middle;
            height: 36px;
          }

          .thumbnail {
            width: 36px;
            height: 36px;
            vertical-align: middle;
            margin-right: 15px;
          }

          .music-control {
            color: #fff;
            vertical-align: middle;
            display: inline-block;
            height: 36px;
          }

          .title-info {
            color: #e8e8e8;
          }

          .music-info {
            line-height: 12px;
          }

          .author-info {
            margin-left: 15px;
            color: #9b9b9b;
          }

          .process {
            width: 100%;
            /* background: #eaeaea; */
            box-shadow: 1px 1px 1px #000;
            background: #000;
            height: 8px;
            border-radius: 5px;
            position: relative;
          }

          .progress-buffered {
            position: absolute;
            left: 0;
            top: 0;
            height: 8px;
            background: #c7c7c7;
            opacity: 0.4;
            z-index: 1;
            border-radius: 5px;
          }

          .progress-played {
            position: absolute;
            left: 0;
            top: 0;
            height: 8px;
            background: #e11b22;
            z-index: 2;
            border-radius: 5px;
          }

          .process-item {
            position: absolute;
            left: -4px;
            top: -4px;
            height: 16px;
            width: 16px;
            z-index: 3;
            border-radius: 50%;
            background: #fff;
          }

          .process-item-inside {
            position: relative;
            background: #e11b22;
            top: 4px;
            left: 4px;
            height: 8px;
            width: 8px;
            z-index: 4;
            border-radius: 50%;
          }

          .process-time {
            margin-top: 8px;
            position: relative;
          }

          .process-wrapper {
            width: 500px;
            height: 8px;
            display: inline-block;
            cursor: pointer;
            vertical-align: middle;
            line-height: 8px;
          }

          .time {
            vertical-align: middle;
            line-height: 12px;
            display: inline-block;
            margin-left: 14px;
            width: 90px;
          }

          .time-division {
            width: 10px;
          }

          .current-time {
            display: inline-block;
            width: 40px;
            text-align: left;
          }

          .total-time {
            display: inline-block;
            width: 40px;
            text-align: right;
          }

          .right-folder {
            display: inline-block;
            margin-left: 30px;
            vertical-align: middle;
            font-size: 20px;
            color: #fff;
          }

          .folder {
            opacity: 0.8;
            cursor: pointer;
          }

          .folder:hover {
            opacity: 1;
          }

          .share {
            opacity: 0.8;
            cursor: pointer;
            margin-left: 8px;
          }

          .share:hover {
            opacity: 1;
          }

          .right-controler {
            display: inline-block;
            vertical-align: middle;
            margin-left: 15px;
            font-size: 20px;
            position: relative;
            color: #fff;
          }

          .right-controler::before {
            width: 2px;
            height: 24px;
            background: #000;
            box-shadow: 1px 1px 1px #000;
            border-radius: 5px;
            display: inline-block;
            content: "";
            margin-right: 15px;
          }

          .volume {
            opacity: 0.8;
            cursor: pointer;
          }

          .volume:hover {
            opacity: 1;
          }

          .volume-controler {
            position: absolute;
            top: -139px;
            left: 9px;
            width: 32px;
            height: 128px;
            background: #333;
            z-index: 1;
          }

          .volume-process {
            position: absolute;
            left: 14px;
            width: 4px;
            height: 100px;
            top: 15px;
            background: #000;
            z-index: 9999;
            border-radius: 5px;
            cursor: pointer;
          }

          .volume-current {
            position: absolute;
            width: 4px;
            bottom: 0;
            background: #e11b22;
            border-radius: 5px;
          }

          .volume-item {
            position: absolute;
            left: -4px;
            bottom: -6px;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #fff;
            cursor: pointer;
          }

          .volume-item-inside {
            position: relative;
            background: #e11b22;
            top: 4px;
            left: 4px;
            height: 4px;
            width: 4px;
            z-index: 2;
            border-radius: 50%;
          }

          .circulation {
            opacity: 0.8;
            cursor: pointer;
            margin-left: 8px;
          }

          .circulation:hover {
            opacity: 1;
          }

          .list {
            opacity: 0.8;
            cursor: pointer;
            margin-left: 8px;
          }

          .list:hover {
            opacity: 1;
          }

          .musicList {
            position: absolute;
            width: 985px;
            left: 50%;
            height: 300px;
            margin-left: -500px;
            background: #333;
            bottom: 52px;
          }

          .music-list-head {
            height: 40px;
            position: relative;
            background: #000;
          }

          .music-list-head-title {
            position: absolute;
            left: 25px;
            top: 0;
            height: 39px;
            font-size: 14px;
            color: #e2e2e2;
            line-height: 39px;
          }

          .music-list-common-icon {
            font-size: 18px;
            vertical-align: middle;
          }

          .music-list-action-icon {
            font-size: 16px;
            vertical-align: middle;
            margin-left: 10px;
            text-align: center;
            /* line-height: 16px; */
          }

          .music-list-common-text {
            vertical-align: middle;
            margin-left: 8px;
          }

          .music-list-head-collect:hover {
            opacity: 1;
          }

          .music-list-head-collect {
            opacity: 0.8;
            position: absolute;
            left: 395px;
            top: 10px;
            height: 15px;
            line-height: 15px;
            color: #ccc;
            cursor: pointer;
            font-size: 12px;
          }

          .music-list-head-line {
            position: absolute;
            left: 475px;
            top: 13px;
            height: 15px;
            line-height: 15px;
            background: red;
            border-left: 1px solid #000;
            border-right: 1px solid #2c2c2c;
          }

          .music-list-head-clear {
            opacity: 0.8;
            position: absolute;
            left: 485px;
            top: 10px;
            height: 15px;
            line-height: 15px;
            font-size: 12px;
            color: #ccc;
            cursor: pointer;
          }

          .music-list-head-clear:hover {
            opacity: 1;
          }

          .music-list-head-name {
            position: absolute;
            left: 590px;
            top: 0;
            width: 346px;
            text-align: center;
            height: 39px;
            line-height: 39px;
            color: #fff;
            font-size: 14px;
          }

          .music-list-head-close {
            opacity: 0.8;
            position: absolute;
            right: 4px;
            top: 6px;
            height: 30px;
            width: 30px;
            line-height: 30px;
            font-size: 12px;
            color: #ccc;
            cursor: pointer;
          }

          .music-list-head-close:hover {
            opacity: 1;
          }

          .music-list-body {
            position: absolute;
            left: 0;
            top: 41px;
            width: 976px;
            height: 260px;
            overflow: hidden;
            background: #262626;
          }

          .music-list-body-content {
            position: absolute;
            left: 2px;
            top: 0;
            width: 540px;
            height: 260px;
            overflow: auto;
          }

          .music-list-body-ul {
            color: #ccc;
          }

          .music-list-li {
            width: 100%;
            list-style: none;
            font-size: 12px;
            opacity: 0.6;
          }

          .music-current {
            background: #121212;
          }

          .music-list-li::after {
            content: " ";
            display: block;
            height: 0;
            clear: both;
          }

          .music-list-li:hover .music-list-li-col-3 {
            visibility: visible;
          }

          .music-list-li:hover {
            background: #000;
            opacity: 1;
          }

          .col {
            float: left;
            padding-left: 8px;
            height: 28px;
            line-height: 28px;
            overflow: hidden;
            cursor: pointer;
            font-weight: bold;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .music-list-li-text {
            font-size: 12px;
            vertical-align: middle;
          }

          .play-triangle-icon {
            vertical-align: middle;
            font-size: 12px;
          }

          .music-list-li-col-1 {
            width: 10px;
          }

          .music-list-li-col-2 {
            width: 215px;
          }

          .music-list-li-col-3 {
            width: 115px;
            visibility: hidden;
          }

          .music-list-li-col-4 {
            width: 70px;
          }

          .music-list-li-col-5 {
            width: 38px;
          }

          .music-list-li-col-6 {
            width: 30px;
            text-align: center;
          }

          .music-list-body-lyric {
            position: absolute;
            left: 542px;
            width: 435px;
            height: 260px;
            overflow: hidden;
            background: gray;
            /* opacity: 0.01; */
          }
        `}</style>
        <style jsx>{`
          {/* @font-face {
            font-family: 'icomoon';
            src:  url('fonts/icomoon.eot?k56501');
            src:  url('fonts/icomoon.eot?k56501#iefix') format('embedded-opentype'),
              url('fonts/icomoon.ttf?k56501') format('truetype'),
              url('fonts/icomoon.woff?k56501') format('woff'),
              url('fonts/icomoon.svg?k56501#icomoon') format('svg');
            font-weight: normal;
            font-style: normal;
          }

          [class^="icon-"], [class*=" icon-"] {
            /* use !important to prevent issues with browser extensions that change fonts */
            font-family: 'icomoon' !important;
            speak: none;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;

            /* Better Font Rendering =========== */
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          .icon-currentPlay:before {
            content: "\e911";
            color: #d81e06;
          }
          .icon-link:before {
            content: "\e910";
            color: #fff;
          }
          .icon-addfile:before {
            content: "\e900";
            color: #fff;
          }
          .icon-clear:before {
            content: "\e901";
            color: #fff;
          }
          .icon-close:before {
            content: "\e902";
            color: #fff;
          }
          .icon-download:before {
            content: "\e903";
            color: #fff;
          }
          .icon-question:before {
            content: "\e904";
            color: #fff;
          }
          .icon-circulation-list:before {
            content: "\e905";
            color: #fff;
          }
          .icon-circulation-random:before {
            content: "\e906";
            color: #fff;
          }
          .icon-circulation-single:before {
            content: "\e907";
            color: #fff;
          }
          .icon-folder:before {
            content: "\e908";
            color: #fff;
          }
          .icon-list:before {
            content: "\e909";
            color: #fff;
          }
          {/* .icon-next:before {
            content: "\e90a";
            color: #fff;
          } */}
          {/* .icon-pause:before {
            content: "\e90b";
            color: #fff;
          } */}
          .jsx-1127568613  {
            content: "\e90b";
            color: #fff;
          }
          {/* .icon-play:before {
            content: "\e90c";
            color: #fff;
          } */}
          {/* .icon-prev:before {
            content: "\e90d";
            color: #fff;
          } */}
          .icon-share:before {
            content: "\e90e";
            color: #fff;
          }
          .icon-volume:before {
            content: "\e90f";
            color: #fff;
          } */}
        `}</style>
      </div>
    );
  }
}

export default AudioPlay
