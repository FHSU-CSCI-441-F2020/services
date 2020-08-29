// Define address model with validation
const address = (sequelize, DataTypes) => {
  const Address = sequelize.define("address", {
    addressNumber: {
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
  });

  Address.associate = (models) => {
    Address.belongsTo(models.Address);
  };

  return Address;
};

export default address;
