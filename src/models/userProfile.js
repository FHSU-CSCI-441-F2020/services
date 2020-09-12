// Define userProfile model with validation
const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define("userProfile", {
    statement: {
      type: DataTypes.STRING,
    },
    education: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    workExperience: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },

    lookingFor: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    skills: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    active: {
      type: DataTypes.BOOLEAN,
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
    userId: {
      type: DataTypes.STRING,
    },
  });

  UserProfile.associate = (models) => {
    UserProfile.belongsTo(models.UserProfile);
  };

  return UserProfile;
};

export default userProfile;
