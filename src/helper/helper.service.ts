import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime, Interval } from 'luxon';

@Injectable()
export class HelperService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Utility method for simulating a delay using promises
   *
   * @example await this.helperService.delay(4000);
   * @param ms - miliseconds to delay
   */
  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * @returns The current DateTime in string format (appropiate for debugging)
   */
  getCurrentDateTime(): string {
    return DateTime.now().toString();
  }

  /**
   * @param startDate - Start date
   * @param endDate - Optional end date. Default is the current DateTime.
   * @returns The interval (elapsed time) between two dates in milliseconds (ms).
   */
  getInterval(startDate: DateTime, endDate: DateTime = DateTime.now()): number {
    return Interval.fromDateTimes(startDate, endDate).length();
  }

  /**
   * Censor an email by placing asterisks on part of the domain
   *
   * @param email - email to censure
   * @returns The censored email
   */
  censorEmail(email: string): string {
    const arr = email.split('@');
    return `${this.censor(arr[0])}@${arr[1]}`;
  }

  /**
   * Censor a word by placing asterisks in the middle of the word
   *
   * @param str - word to censure
   * @param beginning - number of characters at the beginning uncensored
   * @param end - number of characters at the end uncensored
   * @returns The censored word
   */
  censor(str: string, beginning = 2, end = 2): string {
    return str.slice(0, beginning) + '*'.repeat(4) + str.slice(-end);
  }
}
