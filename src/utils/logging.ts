/**
 * Logging & Error Tracking Utility
 * Centralized logging for development and production
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  stackTrace?: string;
}

/**
 * Logger Class
 * Provides structured logging with multiple outputs
 */
export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static logs: LogEntry[] = [];
  private static maxLogs = 100;

  static debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  static info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  static warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  static error(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.ERROR, message, context, errorObj);
  }

  static critical(message: string, error?: Error | unknown, context?: Record<string, any>): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log(LogLevel.CRITICAL, message, context, errorObj);
    // In production, send to error tracking service
    this.sendToErrorTracking(LogLevel.CRITICAL, message, errorObj, context);
  }

  private static log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    const timestamp = new Date().toISOString();
    const stackTrace = error?.stack;

    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      context,
      error,
      stackTrace,
    };

    // Store in memory
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    if (this.isDevelopment) {
      this.consoleLog(logEntry);
    }

    // Errors should always be logged
    if ([LogLevel.ERROR, LogLevel.CRITICAL].includes(level)) {
      this.consoleLog(logEntry);
    }
  }

  private static consoleLog(entry: LogEntry): void {
    const styles = {
      [LogLevel.DEBUG]: 'color: #6c757d; font-weight: bold;',
      [LogLevel.INFO]: 'color: #0dcaf0; font-weight: bold;',
      [LogLevel.WARN]: 'color: #ffc107; font-weight: bold;',
      [LogLevel.ERROR]: 'color: #dc3545; font-weight: bold;',
      [LogLevel.CRITICAL]: 'color: #c71c1c; font-weight: bold; background: #fff3cd;',
    };

    const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;

    if (typeof console !== 'undefined') {
      console.group(`%c${prefix}`, styles[entry.level]);
      console.log(`Message: ${entry.message}`);

      if (entry.context && Object.keys(entry.context).length > 0) {
        console.log('Context:', entry.context);
      }

      if (entry.error) {
        console.log('Error:', entry.error);
        if (entry.stackTrace) {
          console.log('Stack Trace:', entry.stackTrace);
        }
      }

      console.groupEnd();
    }
  }

  private static sendToErrorTracking(
    level: LogLevel,
    message: string,
    error: Error,
    context?: Record<string, any>
  ): void {
    // Integration point for Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        level: level === LogLevel.CRITICAL ? 'fatal' : 'error',
        tags: { logLevel: level },
        extra: {
          message,
          context,
        },
      });
    }
  }

  /**
   * Get all logged entries
   */
  static getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  static getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear all logs
   */
  static clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Performance Monitoring
   */
  static measure<T>(
    label: string,
    fn: () => T,
    context?: Record<string, any>
  ): { result: T; duration: number } {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;

    if (duration > 100) {
      this.warn(`Slow operation: ${label}`, {
        duration: `${duration.toFixed(2)}ms`,
        ...context,
      });
    } else {
      this.debug(`Operation completed: ${label}`, {
        duration: `${duration.toFixed(2)}ms`,
        ...context,
      });
    }

    return { result, duration };
  }

  /**
   * Async Performance Monitoring
   */
  static async measureAsync<T>(
    label: string,
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;

    if (duration > 1000) {
      this.warn(`Slow async operation: ${label}`, {
        duration: `${duration.toFixed(2)}ms`,
        ...context,
      });
    } else {
      this.debug(`Async operation completed: ${label}`, {
        duration: `${duration.toFixed(2)}ms`,
        ...context,
      });
    }

    return { result, duration };
  }
}

/**
 * API Request Logger
 * Logs HTTP requests and responses
 */
export class APILogger {
  static logRequest(method: string, url: string, config?: Record<string, any>): void {
    Logger.debug(`API Request: ${method} ${url}`, config);
  }

  static logResponse(method: string, url: string, status: number, duration: number): void {
    const level = status >= 400 ? LogLevel.WARN : LogLevel.DEBUG;
    Logger[level === LogLevel.WARN ? 'warn' : 'debug'](
      `API Response: ${method} ${url} - ${status}`,
      { duration: `${duration.toFixed(2)}ms` }
    );
  }

  static logError(method: string, url: string, error: Error, duration: number): void {
    Logger.error(`API Error: ${method} ${url}`, error, {
      duration: `${duration.toFixed(2)}ms`,
    });
  }
}

/**
 * Component Render Logger
 * Tracks component renders in development
 */
export class ComponentLogger {
  private static renderCounts: Map<string, number> = new Map();

  static logRender(componentName: string): void {
    const count = (this.renderCounts.get(componentName) || 0) + 1;
    this.renderCounts.set(componentName, count);

    if (count > 5) {
      Logger.warn(`Component re-rendering frequently: ${componentName}`, {
        renderCount: count,
      });
    } else if (process.env.NODE_ENV === 'development') {
      Logger.debug(`Component rendered: ${componentName}`, { renderCount: count });
    }
  }

  static getRenderStats(): Record<string, number> {
    return Object.fromEntries(this.renderCounts);
  }

  static resetStats(): void {
    this.renderCounts.clear();
  }
}

/**
 * Safe JSON Stringify (prevents circular references)
 */
export function safeStringify(obj: any, space = 2): string {
  const seen = new Set();
  return JSON.stringify(
    obj,
    (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular]';
        }
        seen.add(value);
      }
      return value;
    },
    space
  );
}

/**
 * Declare Sentry for type safety
 */
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: any) => void;
    };
  }
}
