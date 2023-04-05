[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/vtMjwcap)
# hw2-handling-input-events
This is the starter code of [2023-Programming User Interface Homework](https://hackmd.io/@akairisu/HkUibgmx3)

## My info

姓名：林首志

學號：R10922088

## My deployed website

[Link](https://musical-jelly-8d30f4.netlify.app/)

## Design

## Bonus

### 垂直大小變化

在使用兩隻手指進行縮放時，若兩隻手指觸及螢幕時的水平距離大於垂直距離，則會進入水平縮放模式；若垂直距離大於等於水平距離，則會進入垂直縮放模式。

除了縮放方向不同之外，我所實作的水平縮放和垂直縮放的行為是一樣的。

### 框選功能

目前尚未實作。

### 加入新的事件處理程序

#### 滾輪事件 (Wheel events)

我加入了針對滑鼠滾輪事件 (Wheel events) 的處理程序。

當有`div`被選取時，滾動滑鼠滾輪可以改變其`border-radius`的屬性。

如果滾輪滾動時有按住`Shift`鍵，則被選取的`div`將會原地旋轉。
- 由於我使用了CSS的`rotate` property（而不是`transform: rotate`），需要較新的瀏覽器版本才能支援旋轉。瀏覽器支援可參考此[連結](https://developer.mozilla.org/en-US/docs/Web/CSS/rotate#browser_compatibility)。

#### Device Motion

當裝置有足夠大的z軸加速度時 (絕對值大於3 m/s²)，所有`div`的位置會在畫面中隨機改變。

## 其他有趣之處

當有`div`被選取時，如果按下鍵盤的`Delete`鍵，會跳出一個alert視窗說明目前不支援刪除操作。
