import { Point } from "./point.ts";
import * as R from "ramda";

const Direction = {
  ArrowUp: new Point(0, -1),
  ArrowRight: new Point(1, 0),
  ArrowDown: new Point(0, 1),
  ArrowLeft: new Point(-1, 0),
} as const;

type Direction = (typeof Direction)[keyof typeof Direction];
type DirectionKey = keyof typeof Direction;

const allowedDirections: Record<DirectionKey, DirectionKey[]> = {
  ArrowUp: ["ArrowLeft", "ArrowRight"],
  ArrowRight: ["ArrowUp", "ArrowDown"],
  ArrowDown: ["ArrowLeft", "ArrowRight"],
  ArrowLeft: ["ArrowUp", "ArrowDown"],
};

const GAME_INTERVAL = 50 as const;

interface Grid {
  width: number;
  height: number;
}

interface State {
  grid: Grid;
  snake: Point[];
  snakeColor: string;
  snakeLength: number;
  fruits: Point[];
  fruitColor: string;
  direction: {
    key: DirectionKey;
    point: Direction;
  };
}

const initialState: State = {
  grid: {
    width: 25,
    height: 25,
  },
  snake: [new Point(5, 5)],
  snakeColor: "#00ff00",
  snakeLength: 5,
  fruits: [new Point(10, 10)],
  fruitColor: "#ff0000",
  direction: {
    key: "ArrowRight",
    point: Direction.ArrowRight,
  },
};

let state: State = R.clone(initialState);
let gameInterval: number | null = null;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

function setDirection(key: DirectionKey): (state: State) => State {
  return function (state: State): State {
    return allowedDirections[state.direction.key].includes(key)
      ? {
          ...state,
          direction: {
            key,
            point: Direction[key],
          },
        }
      : state;
  };
}

function drawPoint(
  ctx: CanvasRenderingContext2D,
  point: Point,
  { width, height }: Grid,
) {
  ctx.fillRect(point.x * width, point.y * height, width, height);
}

function setColor(ctx: CanvasRenderingContext2D, color: string) {
  ctx.fillStyle = color;
}

function nextState(state: State): State {
  return R.pipe(nextFruit, nextSnake)(state);
}

function draw(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  { fruitColor, snakeColor, fruits, grid, snake }: State,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setColor(ctx, fruitColor);
  drawPoint(ctx, fruits[0], grid);

  setColor(ctx, snakeColor);
  snake.forEach((point) => drawPoint(ctx, point, grid));
}

function randomOfRange(range: number) {
  return Math.floor(Math.random() * range);
}

function edgeCollision(value: number, range: number) {
  return value < 0 ? range : value % range;
}

function nextStep({ snake, direction, grid }: State): Point {
  const head = R.last(snake);

  if (!head) {
    throw new Error("Snake has no head");
  }

  return new Point(
    edgeCollision(head.x + direction.point.x, grid.width),
    edgeCollision(head.y + direction.point.y, grid.height),
  );
}

function setTail({ snake, snakeLength }: State): Point[] {
  return R.drop(
    Math.abs(snake.length > snakeLength ? snake.length - snakeLength : 0),
    snake,
  );
}

function nextSnake(state: State): State {
  return R.find(R.equals(nextStep(state)))(state.snake)
    ? {
        ...state,
        snake: [new Point(5, 5)],
        snakeLength: 5,
      }
    : {
        ...state,
        snake: [...setTail(state), nextStep(state)],
      };
}

function nextFruit(state: State): State {
  return R.equals(nextStep(state), state.fruits[0])
    ? {
        ...state,
        fruits: [
          new Point(
            randomOfRange(state.grid.width),
            randomOfRange(state.grid.height),
          ),
        ],
        snakeLength: state.snakeLength + 1,
      }
    : state;
}

window.addEventListener("load", function () {
  canvas = document.querySelector("#game") as HTMLCanvasElement;
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
});

function handleInput({ key: direction }: KeyboardEvent) {
  state = setDirection(direction as DirectionKey)(state);
}

document.addEventListener("keydown", handleInput);

export function startGame() {
  state = R.clone(initialState);

  gameInterval = setInterval(function () {
    draw(ctx, canvas, state);
    state = nextState(state);
  }, GAME_INTERVAL);
}

window.addEventListener("unload", function () {
  gameInterval !== null && clearInterval(gameInterval);
});

// 1. Create a new game instance
// 2. Generate fruit
// 3. Draw snake
// 4. Start game loop
// 5. Check for collisions
// 6. Check for input (keyboard or rwd)
// 7. Move snake
// 8. Update score
// 9. Check for game over
