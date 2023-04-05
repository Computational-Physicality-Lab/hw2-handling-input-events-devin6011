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

const modes = Object.freeze({
    idle: 0,
    mousedown: 1,
    moving: 2,
    following: 3,
    resetting: 4,
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
        mode = modes.idle;
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

const targetMouseupEventHandler = (e) => {
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
    const displacement = currentMouseCoordinate.map((x, i) => x - mousedownOriginalCoordinate[i]);
    const originalCoordinateSplit = mousedownElementOriginalCoordinate.map(x => x.split(/(\d+)/).slice(1));
    const coordinateUnit = originalCoordinateSplit[0][1];
    const newCoordinate = originalCoordinateSplit.map((x, i) => Number(x[0]) + displacement[i] + coordinateUnit);

    mousedownElement.style.left = newCoordinate[0];
    mousedownElement.style.top = newCoordinate[1];
};

const workspaceTouchstartEventHandler = (e) => {
    if(mode === modes.following) {
        const currentMouseCoordinate = [e.touches[0].pageX, e.touches[0].pageY];
        const displacement = currentMouseCoordinate.map((x, i) => x - mousedownOriginalCoordinate[i]);
        const originalCoordinateSplit = mousedownElementOriginalCoordinate.map(x => x.split(/(\d+)/).slice(1));
        const coordinateUnit = originalCoordinateSplit[0][1];
        const newCoordinate = originalCoordinateSplit.map((x, i) => Number(x[0]) + displacement[i] + coordinateUnit);

        mousedownElement.style.left = newCoordinate[0];
        mousedownElement.style.top = newCoordinate[1];
    }
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
    if(mode !== modes.moving && mode !== modes.following) return;

    const currentMouseCoordinate = [e.touches[0].pageX, e.touches[0].pageY];
    const displacement = currentMouseCoordinate.map((x, i) => x - mousedownOriginalCoordinate[i]);
    const originalCoordinateSplit = mousedownElementOriginalCoordinate.map(x => x.split(/(\d+)/).slice(1));
    const coordinateUnit = originalCoordinateSplit[0][1];
    const newCoordinate = originalCoordinateSplit.map((x, i) => Number(x[0]) + displacement[i] + coordinateUnit);

    mousedownElement.style.left = newCoordinate[0];
    mousedownElement.style.top = newCoordinate[1];
};

const workspaceTouchendEventHandler = (e) => {
    if(mode === modes.moving) {
        mode = modes.idle;
    }
    if(mode === modes.mousedown) {
        mode = modes.idle;
    }
};

document.addEventListener('keydown', documentKeydownEventHandler, false);

workspace.addEventListener('click', workspaceClickEventHandler, false);
workspace.addEventListener('mousemove', workspaceMousemoveEventHandler, false);
workspace.addEventListener('touchstart', workspaceTouchstartEventHandler, false);
workspace.addEventListener('touchmove', workspaceTouchmoveEventHandler, false);
workspace.addEventListener('touchend', workspaceTouchendEventHandler, false);

for(const target of targetList) {
    target.addEventListener('click', targetClickEventHandler, false);
    target.addEventListener('dblclick', targetDoubleClickEventHandler, false);
    target.addEventListener('mouseup', targetMouseupEventHandler, false);
    target.addEventListener('mousedown', targetMousedownEventHandler, false);
    target.addEventListener('touchstart', targetTouchstartEventHandler, false);
}
