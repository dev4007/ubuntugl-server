// mlmModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const MLM = sequelize.define('MLM', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requiredMember: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  currentMember: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  emptyPlaces: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
 
});

export default MLM;
