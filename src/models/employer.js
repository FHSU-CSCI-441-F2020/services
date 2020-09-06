// Define employer model with validation
const employer = (sequelize, DataTypes) => {
  const Employer = sequelize.define("employer", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    teamMembers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
    owner: {
      type: DataTypes.STRING,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
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
  });

  Employer.associate = (models) => {
    Employer.belongsTo(models.Employer);
  };

  return Employer;
};

export default employer;
