import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Tile } from '../models/tile.model';
import { ADVANCED, BEGINNER, DIRECTIONS, EXPERT, INTERMEDIATE } from '../app.constants';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, OnDestroy {
  @Input() gameDifficult: string;
  public gameBoard: Tile[][] = [];
  public gameOver: boolean;

  private rows: number;
  private cols: number;
  private bombsCount: number;
  private gameSubscription: Subscription;

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.gameSubscription = this.gameService.onStartGame.subscribe(
      () => {
        this.startGame();
      }
    );
  }

  onElementClick(tile: Tile): void {
    if (tile.hasMine) {
      this.gameOver = true;
      return;
    } else if (tile.nearestBombsCount === 0) {
      this.clearZeroTiles(tile);
    } else {
      tile.isObserved = true;
    }
  }

  private startGame() {
    this.initializeBoardConfiguration();
    this.generateBoard();
    this.placeBombs();
    this.countMineNeighbors();
  }

  private initializeBoardConfiguration(): void {
    this.rows = 10;
    this.cols = 15;
    if (this.gameDifficult === BEGINNER) {
      this.bombsCount = 10;
    } else if (this.gameDifficult === INTERMEDIATE) {
      this.bombsCount = 15;
    } else if (this.gameDifficult === ADVANCED) {
      this.bombsCount = 25;
    } else if (this.gameDifficult === EXPERT) {
      this.bombsCount = 35;
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

  private countMineNeighbors() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const tile = this.gameBoard[y][x];
        if (!tile.hasMine) {
          this.countNeighbourBomb(tile);
        }
      }
    }
  }

  private countNeighbourBomb(tile: Tile): void {
    tile.nearestBombsCount = 0;
    const tileNeighbours = this.getTileNeighbours(tile);
    for (const neighbour of tileNeighbours) {
      if (neighbour.hasMine) {
        tile.nearestBombsCount++;
      }
    }
  }

  private clearZeroTiles(tile: Tile) {
    tile.isObserved = true;
    const tileNeighbours = this.getTileNeighbours(tile);
    const zeroTiles = [];
    for (const neighbour of tileNeighbours) {
      if (neighbour.nearestBombsCount === 0 && !neighbour.isObserved) {
        zeroTiles.push(neighbour);
      } else {
        neighbour.isObserved = true;
      }
    }
    for (const zeroTile of zeroTiles) {
      this.clearZeroTiles(zeroTile);
    }
  }

  private getTileNeighbours(tile: Tile): Tile[] {
    const neighbours: Tile[] = [];
    for (const direction of DIRECTIONS) {
      const currentX = tile.x;
      const currentY = tile.y;
      const neighbourX = currentX + direction.x;
      const neighbourY = currentY + direction.y;
      if (
        (neighbourX >= 0 && neighbourX < this.cols) &&
        (neighbourY >= 0 && neighbourY < this.rows)
      ) {
        const neighbourTile = this.gameBoard[neighbourY][neighbourX];
        neighbours.push(neighbourTile);
      }
    }
    return neighbours;
  }

  ngOnDestroy() {
    this.gameSubscription.unsubscribe();
  }
}
