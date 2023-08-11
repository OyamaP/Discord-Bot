import { Sequelize } from 'sequelize';
import initStorageStampLog, { StorageStampLog } from './StorageStampLog.js';
import sequelizeConfig, { Option } from './config/config.js';
import { envStrings, ENV } from './type.js';
import * as dotenv from 'dotenv';

dotenv.config();

export default class DatabaseClient {
  private readonly sequelize: Sequelize;

  public readonly StorageStampLog: typeof StorageStampLog;

  constructor(env?: string) {
    this.sequelize = this.initSequelize(env);
    this.StorageStampLog = initStorageStampLog(this.sequelize);
    this.associate();
  }

  /**
   * Sequelizeを初期化する
   * @returns
   */
  private initSequelize(env?: string) {
    const config = this.getOption(env);
    const uri = process.env[config.use_env_variable] || 'CONNECTION_URI_LOCAL';

    return new Sequelize(uri, config);
  }

  /**
   * 環境変数からSequelizeのアクセスに必要なOptionを呼び出す
   * config優先度
   * 1. 引数の値
   * 2. 環境変数NODE_ENVの値
   * 3. local
   * @param env
   * @returns
   */
  private getOption(env?: string): Option {
    const ENV = env || process.env.NODE_ENV;
    if (this.isENV(ENV)) {
      return sequelizeConfig[ENV];
    }
    const message = `環境変数:${String(ENV)} は許可されてない値です`;
    console.warn(message);

    return sequelizeConfig.local;
  }

  /**
   * パラメーターがENV文字列のいずれかを判定
   * @param env
   * @returns
   */
  private isENV(env: unknown): env is ENV {
    if (typeof env !== 'string') return false;

    // includes()は利用できないためsome()で代用
    return envStrings.some((envString) => envString === env);
  }

  /**
   * テーブル間の関連付けを行う
   */
  private associate() {}
}
