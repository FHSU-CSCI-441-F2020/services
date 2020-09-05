// Define userProfile model with validation
const userProfile = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define("userProfile", {
    statement: {
      type: DataTypes.STRING,
    },
    education: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    workExperience: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
    address: {
      type: DataTypes.STRING,
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
