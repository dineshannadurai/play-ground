import { getBreadcrumb } from "utils";
import "./index.css";

const pages = [
    { link: "#", name: "Home" },
    { link: "#javascript", name: "Javascript" },
    { link: "#javascript/whack-a-mole", name: "Whack A Mole" },
];

export const template = `
    <div class="whack-a-mole">
        ${getBreadcrumb(pages)}
        <h1>Whack A Mole</h1>
        <div class="field">
            <div class="hole">
                <button>Q</button>
            </div>
            <div class="hole">
                <button>W</button>
            </div>
            <div class="hole">
                <button>E</button>
            </div>
            <div class="hole">
                <button>A</button>
            </div>
            <div class="hole">
                <button>S</button>
            </div>
            <div class="hole">
                <button>D</button>
            </div>
            <div class="hole">
                <button>Z</button>
            </div>
            <div class="hole">
                <button>X</button>
            </div>
            <div class="hole">
                <button>C</button>
            </div>
            <div>
                <button id="start-stop">Start</button>
            </div>
            <div>
                <button id="reset">Reset</button>
            </div>
            <div>
                <span id="score">0</span>
            </div>
        </div>
    </div>
`;

let gameInterval;
let score = 0;
let moleTimeouts = {};

export function initialize() {
    document.title = "Whack A Mole";

    const startStopBtn = document.getElementById("start-stop");
    const resetBtn = document.getElementById("reset");
    const holes = document.querySelectorAll(".hole button");
    const clickListner = moleClickListner.bind({ holes });
    const keyDownListner = docKeyDownListner.bind({ holes });

    startStopBtn.addEventListener("click", () => {
        if (startStopBtn.textContent === "Start") {
            startGame({ holes, keyDownListner, clickListner });
            startStopBtn.textContent = "Stop";
        } else {
            stopGame({ holes, keyDownListner, clickListner });
            startStopBtn.textContent = "Start";
        }
    });
    resetBtn.addEventListener("click", () => {
        const scoreSpan = document.getElementById("score");
        scoreSpan.textContent = 0;
        score = 0;
        holes.forEach(hole => {
            hole.classList.remove("mole");
            hole.classList.remove("whacked");
        });
    });
}

const onMoleClick = hole => {
    if (hole.classList.contains("mole")) {
        score++;
        const scoreSpan = document.getElementById("score");
        scoreSpan.textContent = score;
        hole.classList.remove("mole");
        hole.classList.add("whacked");
        setTimeout(() => {
            hole.classList.remove("whacked");
        }, 100);
    }
};

const KEY_MAPPINGS = {
    q: "0",
    w: "1",
    e: "2",
    a: "3",
    s: "4",
    d: "5",
    z: "6",
    x: "7",
    c: "8",
};

function docKeyDownListner(e) {
    onMoleClick(this.holes[KEY_MAPPINGS[e.key]]);
}

function moleClickListner(e) {
    onMoleClick(e.target);
}

const startGame = ({ holes, keyDownListner, clickListner }) => {
    holes.forEach(hole => {
        hole.addEventListener("click", clickListner);
    });
    document.addEventListener("keydown", keyDownListner);
    gameInterval = setInterval(() => {
        const holeIndex = getRandomHole();
        const showTime = getRandomShowTime();
        showMole(holes[holeIndex], showTime);
    }, 1000);
};

const stopGame = ({ holes, keyDownListner, clickListner }) => {
    if (gameInterval) clearInterval(gameInterval);
    holes.forEach(hole => {
        hole.removeEventListener("click", clickListner);
    });
    document.removeEventListener("keydown", keyDownListner);
    Object.keys(moleTimeouts).forEach(entry => {
        clearTimeout(entry);
    });
    moleTimeouts = {};
};

const getRandomHole = () => {
    return Math.floor(Math.random() * 9);
};

const getRandomShowTime = () => {
    return Math.floor(Math.random() * 2000) + 500;
};

const showMole = (hole, showTime) => {
    if (hole) hole.classList.add("mole");
    const timeout = setTimeout(() => {
        hole.classList.remove("mole");
        delete moleTimeouts[timeout];
    }, showTime);
    moleTimeouts[timeout] = timeout;
};
