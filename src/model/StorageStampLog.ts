import {
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  WhereOptions,
  FindOptions,
} from 'sequelize';

export class StorageStampLog extends Model<
  InferAttributes<StorageStampLog>,
  InferCreationAttributes<StorageStampLog>
> {
  declare id: CreationOptional<number>;

  declare channelId: string;

  declare guildId: string | null;

  declare messageId: string;

  declare userId: string;

  declare userName: string;

  declare discriminator: string;

  declare stampId: string;

  declare createdAt: CreationOptional<Date>;

  /**
   * idで有効なレコードを1つ取得する
   * @param id 
   * @returns 
   */
  static async findById(id: number) {
    const where: WhereOptions = {
      id,
    };
    const findOptions: FindOptions = {
      where,
    };

    try {
      const res = await this.findOne(findOptions);
      return res;
    } catch (e) {
      console.error(e);
      throw new Error('データの取得に失敗しました');
    }
  }

  /**
   * 新規にレコードを挿入する
   * @param record 
   * @returns インサートしたレコード
   */
  static async insertRecord(
    record: {
      channelId: string,
      guildId: string | null,
      messageId: string,
      userId: string,
      userName: string,
      discriminator: string,
      stampId: string,
    },
  ): Promise<StorageStampLog> {
    try {
      const res = await StorageStampLog.create(record);
      return res;
    } catch (e) {
      console.error(e);
      throw new Error('レコード作成に失敗しました');
    }
  }

}

export default (sequelize: Sequelize) => {
  StorageStampLog.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
      },
      channelId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guildId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      messageId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      discriminator: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      stampId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'storage_stamp_log',
      timestamps: true,
    }
  );

  return StorageStampLog;
};
