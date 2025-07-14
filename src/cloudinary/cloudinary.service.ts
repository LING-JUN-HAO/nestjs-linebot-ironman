import { Inject, Injectable } from '@nestjs/common';
import {
  UploadApiOptions,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('Cloudinary')
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadImage(
    imageUploadPayload: Partial<UploadApiOptions> & { stream: Readable },
  ): Promise<UploadApiResponse> {
    const folderName = '2025 IT 鐵人賽';
    const { stream, folder = folderName, public_id } = imageUploadPayload;
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        { folder, public_id },
        (error, result) => {
          if (result) return resolve(result);
          return reject(new Error(error.message));
        },
      );
      stream.pipe(uploadStream);
    });
  }
}
