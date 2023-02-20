/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import {v4 as uuid} from 'uuid';
// import uuid from 'uuid-random';
// const generateUUID = () => parseInt(uuid().replace(/-/g, ''), 16);
const uuidProvider = {
    provide: 'UUID',
    useValue: uuid()}
export const ProvideTokens = {uuid : 'UUID'};
@Global()
@Module({
  providers: [uuidProvider],
  exports: [uuidProvider]
})
export class CommonModule {}