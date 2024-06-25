// userModel.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    sponsorById: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    referralCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
      defaultValue: "Male",
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    wallet: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
 
  },
  {
    tableName: "users",
   hooks: {
      beforeCreate: async (user) => {
        // Generate referral code
        const lastUser = await User.findOne({
          order: [["createdAt", "DESC"]],
        });

        if (!lastUser || !lastUser.referralCode) {
          // If no last user or referral code is empty, set referral code to '1'
          user.referralCode = '1';
        } else {
          const lastReferralCode = parseInt(lastUser.referralCode);
          if (lastReferralCode < 9999999) {
            // Increment referral code by 1
            user.referralCode = (lastReferralCode + 1).toString();
          } else {
            // Set referral code to '9999999' if it reaches the maximum
            user.referralCode = '9999999';
          }
        }
      
      },
    },
  }
);

export default User;
