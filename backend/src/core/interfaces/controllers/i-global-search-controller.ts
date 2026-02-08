import type { RequestHandler } from "express";

export interface IGlobalSearchController {
  search: RequestHandler;
}
