function Draggable(targetElement) {
    this.element = targetElement;
    this.held = false;
    this.diffPt = null;
}

Draggable.prototype.onMouseDown = function (event) {
    this.held = true;
    this.diffPt = {
        x: Number(this.element.style.left.replace("px", "")) - event.clientX,
        y: Number(this.element.style.top.replace("px", "")) - event.clientY,
    };
    this.element.style.cursor = "grabbing";
};

Draggable.prototype.onMouseMove = function (event) {
    if (this.held) {
        this.element.style.left = `${event.clientX + this.diffPt.x}px`;
        this.element.style.top = `${event.clientY + this.diffPt.y}px`;
    }
};

Draggable.prototype.onMouseUp = function () {
    this.held = false;
    this.element.style.cursor = "grab";
};

const makeDraggable = function (target) {
    const draggbleEl = new Draggable(target);
    draggbleEl.element.addEventListener(
        "mousedown",
        draggbleEl.onMouseDown.bind(draggbleEl)
    );
    draggbleEl.element.addEventListener(
        "mouseup",
        draggbleEl.onMouseUp.bind(draggbleEl)
    );
    document.addEventListener(
        "mousemove",
        draggbleEl.onMouseMove.bind(draggbleEl)
    );
};

const myBtn = document.getElementById("dragBtn");

makeDraggable(myBtn);
