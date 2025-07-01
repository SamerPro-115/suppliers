import Config from '@/config';
import pg from 'pg';
import type { Client as PGClient } from 'pg';

export default class db {
  static ready = false;
  static preparing = false; // if both are true = its ready

  static pg: PGClient;

  static async getPG() {
    const client = new pg.Client({
      host: Config.PG.host,
      user: Config.PG.user,
      database: Config.PG.database,
      port: Config.PG.port,
      application_name: Config.PG.app_name
    });

    await client.connect();
    return client;
  }

  static async init(): Promise<void> {
    if (this.preparing) return;
    this.preparing = true;

    this.pg = await this.getPG();

    this.ready = true;
  }

  static async insert<T = number>(table: string, keys: string[], values: any[]) {
    const indexes = Array.from({ length: values.length }, (_, i) => `$${i + 1}`).join(', ');
    const res = await this.pg.query(
      `INSERT INTO ${table} (${keys.join(',')}) VALUES (${indexes}) RETURNING id`,
      values
    );
    return res.rows[0].id as T;
  }
}
