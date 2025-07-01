import { ConfigService } from '@nestjs/config';
import { Params } from 'nestjs-pino';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// 匯出工廠函數給 app.module.ts 使用
export const getLoggerModuleConfig = (configService: ConfigService): Params => {
  const nodeEnv = configService.get<string>('NODE_ENV');

  return {
    pinoHttp: {
      // 日誌等級，開發階段顯示 trace 等級以上的日誌訊息
      level: nodeEnv === 'production' ? 'info' : 'trace',
      // 產生一個事務編號，可以在請求鏈路上都攜帶著，便於紀錄
      genReqId: () => uuidv4(),
      // 自定義想呈現的客製化參數
      customProps: (req: Request) => ({
        reqId: req.id,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        query: req.query,
        params: req.params,
      }),
      // 自定義 HTTP 請求成功顯示訊息方式
      customSuccessMessage: (req: Request, res: Response) =>
        `✅ ${req.method} ${req.url} completed with ${res.statusCode}`,
      // 自定義 HTTP 請求失敗顯示訊息方式
      customErrorMessage: (req, res, err) =>
        `❌ ${req.method} ${req.url} failed: ${err?.message}`,
      // 開發環境專用 pino-pretty 美化 log 輸出
      transport:
        nodeEnv !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true, // 顏色輸出
                singleLine: true, // 單行日誌
                messageFormat:
                  '{if context}【{context}】- {end}{if msg}{msg}{end} {if responseTime}(took {responseTime}ms){end}', // 日誌顯示格式
                ignore: 'context,pid,hostname,responseTime,req,res', // 忽略屬性
                translateTime: 'yyyy-mm-dd HH:MM:ss', //時間格式
                levelFirst: true, // 日誌等級在最前面
              },
            }
          : undefined,
    },
  };
};
