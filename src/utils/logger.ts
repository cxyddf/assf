// 日志工具类
class Logger {
  private isDevelopment = import.meta.env.DEV

  log(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.log(message, ...args)
    }
  }

  error(message: string, ...args: any[]) {
    // 错误日志在生产环境也保留，但可以发送到日志服务
    console.error(message, ...args)
  }

  warn(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.warn(message, ...args)
    }
  }

  info(message: string, ...args: any[]) {
    if (this.isDevelopment) {
      console.info(message, ...args)
    }
  }
}

export const logger = new Logger()
export default logger
