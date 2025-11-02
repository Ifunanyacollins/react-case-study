import BoardRoot from "./board";
import { BoardColumn } from "./boardColumn";

type BoardComponent = typeof BoardRoot & {
  Column: typeof BoardColumn;
};

const Board = BoardRoot as BoardComponent;

Board.Column = BoardColumn;

export { Board };
