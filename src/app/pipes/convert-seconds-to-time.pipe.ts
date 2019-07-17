import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertSecondsToTime'
})
export class ConvertSecondsToTimePipe implements PipeTransform {

  transform(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedSeconds = this.formatNumber(seconds % 60);
    const formattedMinutes = this.formatNumber(minutes % 60);
    const formattedHours = this.formatNumber(hours % 24);

    if (minutes === 0) {
      return `${formattedSeconds}`;
    } else if (hours === 0) {
      return `${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
  }

  private formatNumber(number: number): string {
    if (number < 10) {
      return `0${number}`;
    }
    return `${number}`;
  }

}
