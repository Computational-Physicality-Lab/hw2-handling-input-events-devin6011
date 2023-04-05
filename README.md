[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/vtMjwcap)
# hw2-handling-input-events
This is the starter code of [2023-Programming User Interface Homework](https://hackmd.io/@akairisu/HkUibgmx3)

## My info

姓名：林首志

學號：R10922088

## My deployed website

[Link](https://musical-jelly-8d30f4.netlify.app/)

## Design

我的設計主要是基於 Week 6 MVC這份投影片最後一頁的state diagram的延伸。

我使用一個全域變數`mode`來記憶當前的狀態，總共有七個模式
- idle: 預設的狀態，不做任何事情
- mousedown: 如果原本處於idle狀態，在`div`上mousedown或是touchstart時會進入mousedown模式。如果此時滑鼠移動則會進入moving模式；若沒有移動則會在之後收到點擊事件時處理點擊的輸入。
- moving: 長按拖曳的模式。
- following: 雙擊時進入的跟隨模式。
- resetting: ESC / abort時會進入的模式。這個模式是為了防止在aborting時，受到額外的點擊事件或是觸控事件干擾。（例外：使用`ESC`鍵中止跟隨模式時會直接回到idle模式，因為不會受到額外的點擊事件干擾。）
- hscaling: 水平縮放模式。
- vscaling: 垂直縮放模式。

除了進入縮放模式要求兩隻手指的觸控時間差小於等於0.5秒之外，我都沒有使用時間當作狀態轉移的判斷因素。

### 處理移動操作

在進入長按拖曳模式以及跟隨模式之前，我會在mousedown / touchstart 時先紀錄欲移動物件的起始位置以及當時滑鼠點擊的位置。在進入拖曳模式/跟隨模式之後，每次mousemove時，我會根據當前的滑鼠位置以及之前紀錄的滑鼠位置算出滑鼠的位移，然後將滑鼠的位移加到物件的起始位置上，算出新的物件位置。

### 處理縮放操作

進入縮放模式之前，我會先紀錄選取物件的初始位置及初始大小，以及一開始兩隻手指之間的距離，並根據兩隻手指之間的水平距離與垂直距離決定要進入水平縮放模式還是垂直縮放模式。（見下面Bonus區塊的描述）

在縮放模式時，每次遇到touchmove事件，我會計算當前兩隻手指之間的距離，並根據之前紀錄的兩指距離算出「當前兩指距離與初始兩指距離」的差值，並以這個數值算出縮放之後的長寬。（此時會確保縮放之後不會比最小長寬`20px`還小。）除了計算縮放之後的長寬之外，為了確保物件的中心點不變，我也會算出新的物件座標以達到物件中心點位置不變的效果。

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

當裝置有足夠大的z軸加速度時 (絕對值大於3 m/s²，很容易就可以達成，應該不會傷害到使用者的裝置)，所有`div`的位置會在畫面中隨機改變。

## 其他有趣之處

當有`div`被選取時，如果按下鍵盤的`Delete`鍵，會跳出一個alert視窗說明目前不支援刪除操作。
