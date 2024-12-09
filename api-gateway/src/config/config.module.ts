import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './services/config.service';
import { Config, ConfigSchema } from './schemas/config.schema';

@Module({
  imports: [
    
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }])],
  providers: [ConfigService]
})
export class ConfigModule {}
