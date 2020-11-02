// Define job model with validation
const job = (sequelize, DataTypes) => {
  const Job = sequelize.define("job", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    requirements: {
      type: DataTypes.STRING,
    },
    hours: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING,
    },
    applicants: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    owner: {
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
    },
  });

  Job.associate = (models) => {
    Job.belongsTo(models.Job);
  };

  return Job;
};

export default job;
