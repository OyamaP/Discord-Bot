'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storage_stamp_logs', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      channelId: {
        type: Sequelize.STRING,
        comment: 'チャンネルID',
        allowNull: false,
      },
      guildId: {
        type: Sequelize.STRING,
        comment: 'ギルドID',
        allowNull: true,
      },
      messageId: {
        type: Sequelize.STRING,
        comment: 'メッセージID',
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        comment: 'ユーザーID',
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING,
        comment: 'ユーザー名',
        allowNull: false,
      },
      stampName: {
        type: Sequelize.STRING,
        comment: 'スタンプ名',
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        comment: 'レコード作成日時',
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('storage_stamp_logs');
  },
};
