// Define user model with validation
const job = (sequelize, DataTypes) => {
  const Job = sequelize.define("job", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requirements: {
      type: DataTypes.STRING,
      allowNull: false,
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
    hours: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.STRING,
    },
    applicants: {
      type: DataTypes.ARRAY(DataTypes.STRING),
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  });

  // Job.associate = (models) => {
  //   Job.hasMany(models.Job, {
  //     onDelete: "CASCADE",
  //   });
  //   Job.belongsTo(models.Employer, {
  //     foreignKey: "owner",
  //   });
  // };
  Job.associate = (models) => {
    Job.belongsTo(models.Job);
  };

  return Job;
};

export default job;
