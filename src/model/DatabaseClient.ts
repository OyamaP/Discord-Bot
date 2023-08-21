import "env";
import { Sequelize } from "sequelize";
import "mysql2";
import initStorageStampLog, { StorageStampLog } from "./StorageStampLog.ts";
// @deno-types="./config/config.d.ts"
import sequelizeConfig from "./config/config.js";
import { ENV, ENV_STRINGS } from "./type.ts";

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
  private initSequelize(env?: string): Sequelize {
    const option = this.getOption(env);
    const envVariable = option.use_env_variable;
    const uri = Deno.env.get(envVariable);
    if (uri === undefined) throw new Error("DB接続URIが定義されていません");

    return new Sequelize(uri, option);
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
  private getOption(env?: string): typeof sequelizeConfig[ENV] {
    const ENV = env || Deno.env.get("NODE_ENV");
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
    if (typeof env !== "string") return false;

    // includes()は利用できないためsome()で代用
    return ENV_STRINGS.some((envString) => envString === env);
  }

  /**
   * テーブル間の関連付けを行う
   */
  private associate() {}

  // public async test() {
  //   await this.sequelize.authenticate();
  //   await this.sequelize.sync({
  //     alter: true
  //   })
  // }
}
