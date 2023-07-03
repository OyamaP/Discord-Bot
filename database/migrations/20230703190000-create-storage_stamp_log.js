'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('storage_stamp_log', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        primaryKey: true,
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
      discriminator: {
        type: Sequelize.STRING,
        comment: 'ユーザー識別子',
        allowNull: false,
      },
      stampId: {
        type: Sequelize.STRING,
        comment: 'スタンプID',
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
    await queryInterface.dropTable('storage_stamp_log');
  },
};
