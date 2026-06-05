import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import type { Express } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: Express | null = null;

async function createApp(): Promise<Express> {
  if (cachedApp) return cachedApp;

  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn'] },
  );

  console.log('[CORS] FRONTEND_URL =', process.env.FRONTEND_URL);
  nestApp.enableCors({
    origin: (_origin: string, callback: (err: Error | null, allow?: string) => void) => {
      callback(null, process.env.FRONTEND_URL ?? 'http://localhost:3000');
    },
    credentials: true,
  });

  await nestApp.init();
  cachedApp = expressApp;
  return cachedApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await createApp();
  app(req as any, res as any);
}

