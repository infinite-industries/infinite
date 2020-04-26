/**
 * @swagger
 *
 * definitions:
 *  Announcement:
 *    type: object
 *    properties:
 *       id:
 *        type: string
 *       message:
 *        type: string
 */

// ID is left off so that postgres does not try to force insertions
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('announcement', {
    message: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {})
}
