/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const workspace = document.getElementById('workspace');
const targetList = document.getElementsByClassName('target');
let selected = null;
let mousedownElement = null;
let mousedownElementOriginalCoordinate = null;
let mousedownOriginalCoordinate = null;

let lastTouchTime = 0;

let selectedOriginalDimension = null;
let selectedOriginalCoordinate = null;
let scalingOriginalDistance = null;
let minimumDimension = [20, 20];

const modes = Object.freeze({
    idle: 0,
    mousedown: 1,
    moving: 2,
    following: 3,
    resetting: 4,
    hscaling: 5,
    vscaling: 6,
});
let mode = modes.idle;


const documentKeydownEventHandler = (e) => {
    if(e.key === 'Escape') {
        if(mode === modes.moving || mode === modes.following) {
            mousedownElement.style.left = mousedownElementOriginalCoordinate[0];
            mousedownElement.style.top = mousedownElementOriginalCoordinate[1];
            if(mode === modes.moving) {
                mode = modes.resetting;
            }
            else {
                mode = modes.idle;
            }
        }
    }
    else if(e.key === 'Delete') {
        if(selected) {
            alert("We don't support deletion yet!");
        }
    }
};

const selectElement = (element) => {
    /* if element === null -> select nothing */

    if(selected) { /* deselect the previous item */
        selected.style.backgroundColor = null; /* use css default value */
    }

    selected = element;
    if(selected) {
        selected.style.backgroundColor = '#00f';
    }
};

const workspaceClickEventHandler = (e) => {
    if(mode === modes.idle) {
        selectElement(null);
    }
    else if(mode === modes.resetting) {
        if(!e.touches || e.touches.length === 0) {
            mode = modes.idle;
        }
    }
};

const targetClickEventHandler = (e) => {
    if(mode === modes.mousedown) {
        selectElement(e.currentTarget);
        mode = modes.idle;
    }
    else if(mode === modes.moving) {
        mode = modes.idle;
    }
    e.stopPropagation();
};

const targetDoubleClickEventHandler = (e) => {
    if(mode === modes.idle) {
        mode = modes.following;
    }
};

const workspaceMouseupEventHandler = (e) => {
    if(mode === modes.following) {
        mode = modes.idle;
    }
};

const targetMousedownEventHandler = (e) => {
    if(mode === modes.idle) {
        mode = modes.mousedown;
        mousedownElement = e.currentTarget;
        mousedownElementOriginalCoordinate = [mousedownElement.style.left, mousedownElement.style.top];
        mousedownOriginalCoordinate = [e.pageX, e.pageY];
    }
};

const workspaceMousemoveEventHandler = (e) => {
    if(mode === modes.mousedown) {
        mode = modes.moving;
    }
    if(mode !== modes.moving && mode !== modes.following) return;

    const currentMouseCoordinate = [e.pageX, e.pageY];
    const displacement = currentMouseCoordinate.map((x, i) => Math.round(x - mousedownOriginalCoordinate[i]));
    const newCoordinate = mousedownElementOriginalCoordinate.map((x, i) => parseInt(x) + displacement[i] + 'px');

    mousedownElement.style.left = newCoordinate[0];
    mousedownElement.style.top = newCoordinate[1];
};

const workspaceTouchstartEventHandler = (e) => {
    if(mode === modes.following) {
        if(e.touches.length >= 2) {
            mousedownElement.style.left = mousedownElementOriginalCoordinate[0];
            mousedownElement.style.top = mousedownElementOriginalCoordinate[1];
            mode = modes.resetting;
        }
        else {
            const currentMouseCoordinate = [e.touches[0].pageX, e.touches[0].pageY];
            const displacement = currentMouseCoordinate.map((x, i) => Math.round(x - mousedownOriginalCoordinate[i]));
            const newCoordinate = mousedownElementOriginalCoordinate.map((x, i) => parseInt(x) + displacement[i] + 'px');

            mousedownElement.style.left = newCoordinate[0];
            mousedownElement.style.top = newCoordinate[1];
        }
    }
    else if(mode === modes.moving) {
        if(e.touches.length >= 2) {
            mousedownElement.style.left = mousedownElementOriginalCoordinate[0];
            mousedownElement.style.top = mousedownElementOriginalCoordinate[1];
            mode = modes.resetting;
        }
    }
    else if(mode === modes.idle || mode === modes.mousedown) {
        if(e.touches.length === 2 && selected && (Date.now() - lastTouchTime) <= 500) { // 0.5 second
            selectedOriginalDimension = [selected.style.width, selected.style.height];
            selectedOriginalCoordinate = [selected.style.left, selected.style.top];
            scalingOriginalDistance = [Math.abs(e.touches[0].pageX - e.touches[1].pageX), Math.abs(e.touches[0].pageY - e.touches[1].pageY)];
            if(scalingOriginalDistance[0] > scalingOriginalDistance[1]) {
                mode = modes.hscaling;
            }
            else {
                mode = modes.vscaling;
            }
        }
    }
    else if(mode === modes.hscaling || mode === modes.vscaling) {
        if(e.touches.length >= 3) {
            selected.style.width = selectedOriginalDimension[0];
            selected.style.height = selectedOriginalDimension[1];
            selected.style.left = selectedOriginalCoordinate[0];
            selected.style.top = selectedOriginalCoordinate[1];
            mode = modes.resetting;
        }
    }
    lastTouchTime = Date.now();
};

const targetTouchstartEventHandler = (e) => {
    if(mode === modes.idle) {
        mode = modes.mousedown;
        mousedownElement = e.currentTarget;
        mousedownElementOriginalCoordinate = [mousedownElement.style.left, mousedownElement.style.top];
        mousedownOriginalCoordinate = [e.touches[0].pageX, e.touches[0].pageY];
    }
};

const workspaceTouchmoveEventHandler = (e) => {
    if(mode === modes.mousedown) {
        mode = modes.moving;
    }

    if(mode === modes.moving || mode === modes.following) {
        const currentMouseCoordinate = [e.touches[0].pageX, e.touches[0].pageY];
        const displacement = currentMouseCoordinate.map((x, i) => Math.round(x - mousedownOriginalCoordinate[i]));
        const newCoordinate = mousedownElementOriginalCoordinate.map((x, i) => parseInt(x) + displacement[i] + 'px');

        mousedownElement.style.left = newCoordinate[0];
        mousedownElement.style.top = newCoordinate[1];
    }
    else if(mode === modes.hscaling || mode === modes.vscaling) {
        if(e.touches.length === 2) {
            const currentScalingDistance = [Math.abs(e.touches[0].pageX - e.touches[1].pageX), Math.abs(e.touches[0].pageY - e.touches[1].pageY)];
            const distanceDiff = currentScalingDistance.map((x, i) => Math.round(x - scalingOriginalDistance[i]));
            const newDimension = selectedOriginalDimension.map((x, i) => Math.max(parseInt(x) + distanceDiff[i], minimumDimension[i]) + 'px');
            const newCoordinate = selectedOriginalCoordinate.map((x, i) => parseInt(x) - Math.round((parseInt(newDimension[i]) - parseInt(selectedOriginalDimension[i])) / 2) + 'px');

            if(mode === modes.hscaling) {
                selected.style.width = newDimension[0];
                selected.style.left = newCoordinate[0];
            }
            if(mode === modes.vscaling) {
                selected.style.height = newDimension[1];
                selected.style.top = newCoordinate[1];
            }
        }
    }
};

const workspaceTouchendEventHandler = (e) => {
    if(mode === modes.moving) {
        mode = modes.idle;
    }
    else if(mode === modes.mousedown) {
        mode = modes.idle;
    }
    else if(mode === modes.resetting) {
        if(e.touches.length === 0) {
            mode = modes.idle;
        }
    }
    else if(mode === modes.hscaling || mode === modes.vscaling) {
        if(e.touches.length === 0) {
            mode = modes.idle;
        }
    }
};

const workspaceWheelEventHandler = (e) => {
    if(selected) {
        if(e.shiftKey) {
            const currentRotate = parseFloat(selected.style.rotate || '0turn');
            selected.style.rotate = (currentRotate + e.deltaY * 0.0003) + 'turn';
        }
        else {
            const currentBorderRadius = parseFloat(selected.style.borderRadius || '0%');
            selected.style.borderRadius = Math.min(Math.max(currentBorderRadius + e.deltaY * -0.03, 0), 50) + '%';
        }
    }
};

const getRandomInt = (minValue, maxValue) => {
    minValue = Math.ceil(minValue);
    maxValue = Math.floor(maxValue);
    return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
};

const devicemotionEventHandler = (e) => {
    const {x, y, z} = e.acceleration;
    if(Math.abs(z) > 3) {
        const windowWidth = document.body.clientWidth;
        const windowHeight = document.body.clientHeight;

        for(const target of targetList) {
            const targetDimension = [target.style.width, target.style.height];
            target.style.left = getRandomInt(10, Math.max(10, windowWidth - parseInt(targetDimension[0]) - 10)) + 'px';
            target.style.top = getRandomInt(10, Math.max(10, windowHeight - parseInt(targetDimension[1]) - 10)) + 'px';
        }
    }
};

window.addEventListener('devicemotion', devicemotionEventHandler, false);

document.addEventListener('keydown', documentKeydownEventHandler, false);

workspace.addEventListener('click', workspaceClickEventHandler, false);
workspace.addEventListener('mousemove', workspaceMousemoveEventHandler, false);
workspace.addEventListener('mouseup', workspaceMouseupEventHandler, false);
workspace.addEventListener('touchstart', workspaceTouchstartEventHandler, false);
workspace.addEventListener('touchmove', workspaceTouchmoveEventHandler, false);
workspace.addEventListener('touchend', workspaceTouchendEventHandler, false);
workspace.addEventListener('wheel', workspaceWheelEventHandler, false);

for(const target of targetList) {
    target.addEventListener('click', targetClickEventHandler, false);
    target.addEventListener('dblclick', targetDoubleClickEventHandler, false);
    target.addEventListener('mousedown', targetMousedownEventHandler, false);
    target.addEventListener('touchstart', targetTouchstartEventHandler, false);
}
