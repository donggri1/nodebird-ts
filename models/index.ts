import  Sequelize from 'sequelize';
import  fs from 'fs';
import  path from 'path';
import  User from './user';
import  Post from './post';
import Community from './community';
import  Hashtag from './hashtag';
import configObj from '../config/config';//config.json 파일을 불러온다.

const env = process.env.NODE_ENV as 'production' | 'test'|| 'development';
const config = configObj[env]; //config.json 파일에서 현재 환경에 맞는 설정을 불러온다.
const sequelize = new Sequelize.Sequelize(
  config.database,config.username,config.password,config,
);

const db = {
  sequelize,
  User,
  Post,
  Hashtag,
  Community,
}

User.initiate(sequelize); // User 모델을 초기화한다.
Post.initiate(sequelize); // User 모델을 초기화한다.
Hashtag.initiate(sequelize); // User 모델을 초기화한다.
Community.initiate(sequelize); // User 모델을 초기화한다.

User.associate(db); // User 모델의 관계를 설정한다.
Post.associate(db); // Post 모델의 관계를 설정한다. 
Hashtag.associate(); // Hashtag 모델의 관계를 설정한다.
Community.associate(db); 


export {User, Post, Hashtag,Community, sequelize}; // User, Post, Hashtag 모델과 sequelize 객체를 export 한다.
