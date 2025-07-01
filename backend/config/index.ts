// @ts-nocheck
import configJSON from '@r/config.json';

export default class Config {
  static get port() {
    return configJSON.port ?? 80;
  }

  static get host() {
    return configJSON.host ?? '0.0.0.0';
  }

  static get PG() {
    return {
      app_name: 'app',
      user: 'app',
      host: 'localhost',
      port: 5432,
      database: 'suppliers',

      ...configJSON.PG
    };
  }

  static get JWTSecret() {
    return process.env.JWT_SECRET ?? configJSON.JWT_SECRET;
  }

  static get AllowOrigin() {
    return configJSON['Access-Control-Allow-Origin'];
  }
}
