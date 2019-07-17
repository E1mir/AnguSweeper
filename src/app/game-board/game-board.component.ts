import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Tile } from '../models/tile.model';
import { EASY, HARD, MEDIUM } from '../app.constants';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GameBoardComponent implements OnInit, OnChanges {
  @Input() gameDifficult: string;
  gameBoard: Tile[][] = [];

  private rows: number;
  private cols: number;
  private bombsCount: number;

  constructor(private detectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.startGame();
  }

  ngOnChanges(changes) {
    this.startGame();
  }

  onElementClick(tile: Tile) {
    if (tile.hasMine) {

    }
    tile.isObserved = true;
  }

  private startGame() {
    this.initializeBoardConfiguration();
    this.generateBoard();
    this.placeBombs();
  }

  private initializeBoardConfiguration(): void {
    console.log(this.gameDifficult);
    if (this.gameDifficult === EASY) {
      this.rows = 10;
      this.cols = 10;
      this.bombsCount = 10;
    } else if (this.gameDifficult === MEDIUM) {
      this.rows = 15;
      this.cols = 15;
      this.bombsCount = 35;
    } else if (this.gameDifficult === HARD) {
      this.rows = 20;
      this.cols = 20;
      this.bombsCount = 100;
    }
  }

  private generateBoard() {
    this.gameBoard = [];
    for (let y = 0; y < this.rows; y++) {
      const row = [];
      for (let x = 0; x < this.cols; x++) {
        const tile = new Tile(x, y);
        row.push(tile);
      }
      this.gameBoard.push(row);
    }
  }

  private placeBombs() {
    let bombsLeft = this.bombsCount;
    while (bombsLeft !== 0) {
      const x = Math.floor(Math.random() * this.cols);
      const y = Math.floor(Math.random() * this.rows);
      const tile = this.gameBoard[y][x];
      if (!tile.hasMine) {
        tile.hasMine = true;
        bombsLeft--;
      }
    }
  }
}
