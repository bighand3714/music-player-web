export default () => (
  <div className="root">
    <style jsx global>{`
      /* 
      滚动条的设置
      ::-webkit-scrollbar 滚动条整体部分，可以设置宽度啥的
      ::-webkit-scrollbar-button 滚动条两端的按钮
      ::-webkit-scrollbar-track  外层轨道
      ::-webkit-scrollbar-track-piece  内层滚动槽
      ::-webkit-scrollbar-thumb 滚动的滑块
      ::-webkit-scrollbar-corner 边角
      ::-webkit-resizer 定义右下角拖动块的样式
      */
      
      ::-webkit-scrollbar {
        width: 5px;
        background-color: #111111;
      }

      ::-webkit-scrollbar-thumb {
        background-color: #666666;
      }
    `}</style>
  </div>
)
  