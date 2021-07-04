import * as path from 'path';
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: path.join(__dirname + '/../../.env'),
});
const db: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  synchronize: process.env.TYPEORM_SYNC == 'true',
  autoLoadEntities: true,
}

const jwt = {
  secret: process.env.JWT_SECRET,
  resetSecret: process.env.JWT_RESET,
  expires_in: process.env.JWT_EXPIRE
}

export const Config = {
  db, jwt
}