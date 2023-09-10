import "./style.css";
import { startGame } from "./app.ts";
import { createCanvasElement, createGameOverElement, createPointsElement } from "./elements.ts";

const elements = [
  createPointsElement(),
  createCanvasElement(),
  createGameOverElement(),
];

const appElement = document.querySelector<HTMLDivElement>("#app")! as HTMLDivElement;

elements.forEach((el) => appElement.appendChild(el));

startGame();
