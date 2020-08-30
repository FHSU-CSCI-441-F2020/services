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
    address: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Employer.associate = (models) => {
    Employer.belongsTo(models.Employer);
  };

  return Employer;
};

export default employer;
