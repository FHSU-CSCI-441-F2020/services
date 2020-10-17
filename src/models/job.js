// Define employer model with validation
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
    requirements:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    location:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    hours:{
      type: DataTypes.STRING,
    }
  });

  Job.associate = (models) => {
    Job.hasMany(models.Job, {
      onDelete: 'CASCADE'
    });
    Job.belongsTo(models.Employer, {
      foreignKey: 'owner'
    });
  };

  return Job;
};

export default job;
