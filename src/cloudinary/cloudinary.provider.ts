import { ConfigOptions, v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { Provider } from '@nestjs/common';

export const CLOUDINARY = 'Cloudinary';

const cloudinaryConfig = (configService: ConfigService) => {
  const config: ConfigOptions = {
    cloud_name: configService.get<string>('cloudinary.cloudName'),
    api_key: configService.get<string>('cloudinary.apiKey'),
    api_secret: configService.get<string>('cloudinary.apiSecret'),
  };

  cloudinary.config(config);
  return cloudinary;
};

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => cloudinaryConfig(configService),
  inject: [ConfigService],
};
