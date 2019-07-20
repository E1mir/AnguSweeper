import { FLAGS } from '../app.constants';

export class Tile {
  private _x: number;
  private _y: number;
  private _nearestBombsCount: number;
  private _hasMine: boolean;
  private _isObserved: boolean;
  private _flag: string;

  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  set x(x: number) {
    this._x = x;
  }

  set y(y: number) {
    this._y = y;
  }

  set hasMine(isMine: boolean) {
    this._hasMine = isMine;
  }

  set nearestBombsCount(bombsCount: number) {
    this._nearestBombsCount = bombsCount;
  }

  set isObserved(observed: boolean) {
    if (!this._isObserved) {
      this._isObserved = observed;
    }
  }

  set flag(flag: string) {
    if (flag === null) {
      this._flag = null;
    } else {
      const valid = FLAGS.indexOf(flag) !== -1;
      if (valid) {
        this._flag = flag;
      } else {
        throw Error('Undefined flag!');
      }
    }
  }


  get y(): number {
    return this._y;
  }

  get x(): number {
    return this._x;
  }

  get hasMine(): boolean {
    return this._hasMine;
  }

  get nearestBombsCount(): number {
    return this._nearestBombsCount;
  }

  get isObserved(): boolean {
    return this._isObserved;
  }

  get flag(): string {
    return this._flag;
  }
}
