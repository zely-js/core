import { WatchOptions } from 'chokidar';
import { BuildOptions } from 'esbuild';
import { Request, Response, OsikServer, ServerOptions } from 'osik';
import { FileData, Page } from './core';
import { IncomingMessage, ServerResponse } from 'http';
import { ZelyRequest, ZelyResponse } from './method';

export type Middleware = (req: Request, res: Response, next: any) => void;

export type HandlerType = (
  req: IncomingMessage,
  res: ServerResponse,
  routes: FileData[]
) => void;

export type PluginOutput = FileData | null;

export interface PluginBuildOutput {
  conflict?: {
    /**
     * dependencies that will not be bundled
     *
     * ex) `electron`
     */
    dependencies?: string[];
  };
}

export interface Plugin {
  name: string;
  transform?: (id: string, code: string) => PluginOutput | Promise<PluginOutput>;
  server?: (server: OsikServer) => void;
  build?: () => PluginBuildOutput | void | Promise<PluginBuildOutput | void>;
  config?: (config: Config) => Promise<Config | void> | Config | void;
  pages?: (pages: FileData[]) => Promise<void> | void;
  /**
   * run before server starting
   * @returns void
   */
  setup?: () => void | Promise<void>;
}

export type pureMiddleware = (
  req: IncomingMessage,
  res: ServerResponse,
  next: any
) => void;

export interface Config {
  /**
   * server port
   */
  port?: number;

  /**
   * Directory where page files are located
   */
  routes?: string;

  /**
   * custom middlewares
   */
  middlewares?: Middleware[];

  /**
   * Project root directory (only relative path)
   */
  base?: string;

  handler?: HandlerType;
  /**
   * esbuild build options - https://esbuild.github.io/
   */
  esbuild?: BuildOptions;

  /**
   * zely plugins - https://zely.netlify.app/apis/plugin
   */
  plugins?: Plugin[];

  watch?: {
    enable: boolean;
    options?: WatchOptions;
  };

  /**
   * prebuild pages
   */
  prebuild?: boolean;

  build?: {};
  // https://github.com/do4ng/zely/issues/7
  // error handling

  /**
   * 404 page handler
   * @param req request
   * @param res response
   */
  error?(req: IncomingMessage, res: ServerResponse): void | Promise<void>;

  // auto middleware

  middlewareDirectory?: string;
  allowAutoMiddlewares?: boolean;

  // middleware mode

  server?: {
    middlewareMode?: boolean;

    // osik options
    osik?: ServerOptions;

    /**
     * don't remove cache dir when server start.
     */
    keepCache?: boolean;
  };

  // public directory

  public?: string;
  publicOptions?: StaticOptions;

  useBrackets?: boolean;
}

export function showListen(port: string | number): void;

export interface StaticOptions {
  prefix?: string;

  ignored?: string[];

  charset?: string;
}

export function usePrewrite<T>(
  res: ServerResponse,
  cb: (chunk: T) => T | Promise<T>
): void;

export function support(
  request: Request,
  response: Response
): { request: ZelyRequest; response: ZelyResponse };

export * from './config';
export * from './constants';
export * from './core';
export * from './server';
export * from './method';
export * from './dependencies';
export * from './snatcher';
