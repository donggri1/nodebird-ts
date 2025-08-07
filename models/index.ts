import Sequelize from 'sequelize';
import User from './user';
import Post from './post';
import Hashtag from './hashtag';
import Community from './community';
import configObj from '../config/config';

const env = process.env.NODE_ENV as 'production' | 'test' || 'development';
const config = configObj[env];
const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const db = {
  sequelize,
  User,
  Post,
  Hashtag,
  Community,
};

User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);
Community.initiate(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Community.associate(db);

export { User, Post, Hashtag, Community, sequelize };

export type dbType = typeof db;
export default db;