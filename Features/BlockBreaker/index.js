const canvas = document.getElementById("block-breaker-canvas");

paper.install(window);
paper.setup(canvas);

const gameBoard = new Path.Rectangle(90, 10, 460, 400);
gameBoard.strokeColor = "black";

const ball = new Path.Circle(new Point(330, 362), 6);
ball.strokeColor = "red";
ball.fillColor = "red";

const player = new Path.Rectangle(280, 370, 100, 20);
player.strokeColor = "black";
player.fillColor = "blue";

// let score = 0;

let hitResult = null;

const blocks = [
    new Path.Rectangle(100, 20, 100, 20),
    new Path.Rectangle(220, 20, 100, 20),
    new Path.Rectangle(330, 20, 100, 20),
    new Path.Rectangle(440, 20, 100, 20),
    new Path.Rectangle(100, 50, 100, 20),
    new Path.Rectangle(220, 50, 100, 20),
    new Path.Rectangle(330, 50, 100, 20),
    new Path.Rectangle(440, 50, 100, 20),
    new Path.Rectangle(100, 80, 100, 20),
    new Path.Rectangle(220, 80, 100, 20),
    new Path.Rectangle(330, 80, 100, 20),
    new Path.Rectangle(440, 80, 100, 20),
];

for (let i = 0; i < blocks.length; i++) {
    blocks[i].strokeColor = "black";
    blocks[i].fillColor = "purple";
}
const playerTool = new Tool();

playerTool.onMouseDown = (event) => {
    hitResult = player.hitTest(event.point, {
        fill: true,
    });
};

playerTool.onMouseDrag = (event) => {
    if (
        event.point.x > 140 &&
        event.point.x < 500 &&
        hitResult &&
        hitResult.item
    )
        hitResult.item.position.x = event.point.x;
};

playerTool.onMouseUp = () => {
    hitResult = null;
};

console.log("ball.position", ball.position);
let dirX = -1;
let dirY = -1;

function changeDirection(isVertical) {
    if (dirX === -1 && dirY === -1) {
        if (isVertical) {
            dirX = 1;
        } else {
            dirY = 1;
        }
    } else if (dirX === -1 && dirY === 1) {
        if (isVertical) {
            dirX = 1;
        } else {
            dirY = -1;
        }
    } else if (dirX === 1 && dirY === -1) {
        if (isVertical) {
            dirX = -1;
        } else {
            dirY = 1;
        }
    } else if (dirX === 1 && dirY === 1) {
        if (isVertical) {
            dirX = -1;
        } else {
            dirY = -1;
        }
    }
}

view.onFrame = () => {
    ball.position.x = ball.position.x + dirX;
    ball.position.y = ball.position.y + dirY;
    const hitBoard = gameBoard.hitTest(ball.position);
    let hitBlocks = null;
    for (let a = 0; a < blocks.length; a++) {
        hitBlocks = blocks[a].hitTest(ball.position);
        if (hitBlocks) {
            blocks[a].remove();
            blocks.splice(a, 1);
            // score++;
            break;
        }
    }
    if (!blocks.length) {
        // score = "WINNER!";
        view.pause();
    }
    if (hitBoard && hitBoard.point.y > 370) {
        // score = "LOSER!";
        view.pause();
    }
    const hitPlayer = player.hitTest(ball.position);
    const hitSomething = hitBoard || hitBlocks || hitPlayer;
    if (hitSomething) {
        changeDirection(hitSomething.location.curve.isVertical());
    }
};
