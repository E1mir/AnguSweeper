import { Component, OnDestroy, OnInit } from '@angular/core';
import { Tile } from '../models/tile.model';
import { ALL_DIRECTIONS, DIFFICULTY_LEVELS, FLAG_MINE, FOUR_DIRECTIONS } from '../app.constants';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent implements OnInit, OnDestroy {
  public gameBoard: Tile[][] = [];
  public gameOver: boolean;
  public gameWon: boolean;

  private mouseHoldTimeout = null;
  private height: number;
  private width: number;
  private minesCount: number;
  private gameSubscription: Subscription;
  private gameDifficult: string;
  private tilesWithMine: Tile[];

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
    this.gameSubscription = this.gameService.onStartGame.subscribe(
      (difficult: string) => {
        this.gameDifficult = difficult;
        this.startGame();
      }
    );
  }

  tileClicked(tile: Tile) {
    if (!tile.isObserved) {
      if (this.mouseHoldTimeout) {
        clearTimeout(this.mouseHoldTimeout);
        this.mouseHoldTimeout = null;
        this.onElementClicked(tile);
      }
    }
  }

  tileHeld(tile: Tile) {
    if (!tile.isObserved && !this.gameOver && !this.gameWon) {
      this.mouseHoldTimeout = setTimeout(() => {
        if (tile.flag) {
          tile.flag = null;
          this.minesCount++;
        } else if (this.minesCount !== 0) {
          tile.flag = FLAG_MINE;
          this.minesCount--;
          this.isGameWon();
        }
        this.mouseHoldTimeout = null;
      }, 300);
    }
  }

  private onElementClicked(tile: Tile): void {
    if (tile.flag === FLAG_MINE) {
      tile.flag = null;
      return;
    }
    if (tile.hasMine) {
      this.stopGame();
      return;
    }
    if (tile.nearestBombsCount === 0) {
      this.clearZeroTiles(tile);
    } else {
      tile.isObserved = true;
    }
  }

  private startGame(): void {
    this.initializeBoardConfiguration();
    this.generateBoard();
    this.placeBombs();
    this.countMineNeighbors();
  }

  private stopGame() {
    this.gameOver = true;
    this.gameService.stopGame();
  }


  private initializeBoardConfiguration(): void {
    this.gameOver = false;
    this.gameWon = false;
    const difficultyIndex = DIFFICULTY_LEVELS.findIndex((difficult) => this.gameDifficult === difficult.level);
    if (difficultyIndex !== -1) {
      const difficulty = DIFFICULTY_LEVELS[difficultyIndex];
      this.height = difficulty.height;
      this.width = difficulty.width;
      this.minesCount = difficulty.minesCount;
    } else {
      throw Error('Undefined difficulty level');
    }
  }

  private generateBoard(): void {
    this.gameBoard = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const tile = new Tile(x, y);
        row.push(tile);
      }
      this.gameBoard.push(row);
    }
  }

  private placeBombs(): void {
    this.tilesWithMine = [];
    let bombsLeft = this.minesCount;
    while (bombsLeft !== 0) {
      const x = Math.floor(Math.random() * this.width);
      const y = Math.floor(Math.random() * this.height);
      const tile = this.gameBoard[y][x];
      if (!tile.hasMine) {
        tile.hasMine = true;
        this.tilesWithMine.push(tile);
        bombsLeft--;
      }
    }
  }

  private countMineNeighbors(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
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

  private clearZeroTiles(tile: Tile): void {
    tile.isObserved = true;
    const tileNeighbours = this.getTileNeighbours(tile, false);
    const zeroTiles = [];
    for (const neighbour of tileNeighbours) {
      if (neighbour.nearestBombsCount === 0 && !neighbour.isObserved) {
        zeroTiles.push(neighbour);
      } else {
        neighbour.isObserved = true;
        neighbour.flag = null;
      }
    }
    for (const zeroTile of zeroTiles) {
      this.clearZeroTiles(zeroTile);
    }
  }

  private getTileNeighbours(tile: Tile, onAllDirections: boolean = true): Tile[] {
    const neighbours: Tile[] = [];
    const directions = onAllDirections ? ALL_DIRECTIONS : FOUR_DIRECTIONS;
    for (const direction of directions) {
      const currentX = tile.x;
      const currentY = tile.y;
      const neighbourX = currentX + direction.x;
      const neighbourY = currentY + direction.y;
      if (
        (neighbourX >= 0 && neighbourX < this.width) &&
        (neighbourY >= 0 && neighbourY < this.height)
      ) {
        const neighbourTile = this.gameBoard[neighbourY][neighbourX];
        neighbours.push(neighbourTile);
      }
    }
    return neighbours;
  }

  private isGameWon() {
    this.gameWon = this.tilesWithMine.findIndex((tile) => tile.flag !== FLAG_MINE) === -1;
    if (this.gameWon) {
      this.gameService.gameWon(this.gameDifficult);
    }
  }

  ngOnDestroy(): void {
    this.gameSubscription.unsubscribe();
  }
}
