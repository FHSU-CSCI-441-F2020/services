"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const application = (sequelize, DataTypes) => {
  const Application = sequelize.define("application", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phonenumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    highereducation:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    schoolname:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    degree:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    degreestatus:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    schoolcountry:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    employername: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    jobtitle: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    startdatemonth: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    startdateyear: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    enddatemonth: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    enddateyear: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    employercountry: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    employercity: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    employerstate: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    currentemployer: {
      type: DataTypes.BOOLEAN,
    },
    coverletter:{
      type: DataTypes.STRING,
    }
  });

  Application.associate = (models) => {
    Application.belongsTo(models.User, {
      foreignKey: 'owner'
    });
  };

  return Application;
};

var _default = application;
exports.default = _default;
//# sourceMappingURL=job.js.map