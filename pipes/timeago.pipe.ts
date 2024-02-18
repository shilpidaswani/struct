// import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({ name: 'timeAgo' })
// export class TimeAgoPipe implements PipeTransform {
//   transform(d: any): string {
// let currentDate = new Date(new Date().toUTCString());
// let date = new Date(d);

// let year = currentDate.getFullYear() - date.getFullYear();
// let month = currentDate.getMonth() - date.getMonth();
// let day = currentDate.getDate() - date.getDate();
// let hour = currentDate.getHours() - date.getHours();
// let minute = currentDate.getMinutes() - date.getMinutes();
// let second = currentDate.getSeconds() - date.getSeconds();

// let createdSecond = (year * 31556926) + (month * 2629746) + (day * 86400) + (hour * 3600) + (minute * 60) + second;

// if (createdSecond >= 31556926) {
//   let yearAgo = Math.floor(createdSecond / 31556926);
//   return yearAgo > 1 ? yearAgo + " years ago" : yearAgo + " year ago";
// } else if (createdSecond >= 2629746) {
//   let monthAgo = Math.floor(createdSecond / 2629746);
//   return monthAgo > 1 ? monthAgo + " months ago" : monthAgo + " month ago";
// } else if (createdSecond >= 86400) {
//   let dayAgo = Math.floor(createdSecond / 86400);
//   return dayAgo > 1 ? dayAgo + " days ago" : dayAgo + " day ago";
// } else if (createdSecond >= 3600) {
//   let hourAgo = Math.floor(createdSecond / 3600);
//   return hourAgo > 1 ? hourAgo + " hours ago" : hourAgo + " hour ago";
// } else if (createdSecond >= 60) {
//   let minuteAgo = Math.floor(createdSecond / 60);
//   return minuteAgo > 1 ? minuteAgo + " minutes ago" : minuteAgo + " minute ago";
// } else if (createdSecond < 60) {
//   return "just now";
// } else if (createdSecond < 0) {
//   return "0 second ago";
// }
//   }
// }

import { Pipe, PipeTransform } from '@angular/core';

import * as _moment from 'moment';
@Pipe({
    name: 'appTimeAgo'
})
export class TimeAgoPipe implements PipeTransform {

    transform(input: any, formatType: string): any {
        const me = this;
        const format = me.dateFormat(formatType);

        if (!input) {
            return null;
        }

        return _moment.utc(input).local().format(format);
    }

    dateFormat(formatType: string): string {

        switch (formatType) {
            case 'shortDate':
                return 'DD MMM YYYY';
            case 'normalDate':
                return 'DD MMM YY';
            case 'normalDateWithTime':
                return 'MM/DD/yy h:mm a';
            case 'normalTimeWithDate':
                return 'h:mm A, DD/MM/yyyy';
            case 'normalTimeWithDateNoComma':
                return 'h:mm A DD/MM/yyyy';
            case 'fullTimeAndDate':
                return 'DD MMM YY HH:mm';
            case 'mediumDate':
                return 'DD MMM YYYY  hh:mm A';
            case 'longDate':
                return 'DD MMM YYYY hh:mm:ss A';
            case 'normalDateWithDay':
                return 'dddd, d/M/yy';
            case 'yearMonthDate':
                return 'YY-MM-DD';
            case 'longTime':
                return 'h:mm:ss a';
            case 'mediumTime':
                return 'h:mm a';
            case 'FullYearDateAndTime':
                return 'YYYY-MM-DD HH:mm:ss';
            case 'FullYearDate':
                return 'YYYY-MM-DD';
        }
    }

}
@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
      //console.log(value);

      if (value) {
          const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);

          // const hour = Math.floor((+new Date() - +new Date(value)) / (h * 60 * 60 * 1000));
          //console.log(seconds);

          if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
              return 'just now';
          // if (seconds > 3599 && seconds < 7200)
          //     return '1 hour ago'
          // if (seconds > 3600 && seconds < 86400) {
          //     return 'today';
          // }
          const intervals = {
              'year': 31536000,
              'month': 2592000,
              'week': 604800,
              'day': 86400,
              'hour': 3600,
              'minute': 60,
              'second': 1
          };
          let counter;
          for (const i in intervals) {
              counter = Math.floor(seconds / intervals[i]);
              if (counter > 0)
                  if (counter === 1) {
                      return counter + ' ' + i + ' ago'; // singular (1 day ago)
                  } else {
                      return counter + ' ' + i + 's ago'; // plural (2 days ago)
                  }
          }
      }
      return value;
  }

}
