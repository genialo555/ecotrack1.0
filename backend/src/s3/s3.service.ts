import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

interface UploadOptions {
  contentType: string;
  metadata?: Record<string, string>;
}

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION'),
    });
    this.bucket = this.configService.get('AWS_S3_BUCKET');
  }

  async uploadPublicFile(
    key: string,
    buffer: Buffer,
    mimetype: string,
  ): Promise<{ key: string; url: string }> {
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucket,
          Body: buffer,
          Key: key,
          ContentType: mimetype,
          ACL: 'private',
          ServerSideEncryption: 'AES256',
        })
        .promise();

      this.logger.log(`File uploaded successfully to ${uploadResult.Location}`);

      return {
        key: uploadResult.Key,
        url: uploadResult.Location,
      };
    } catch (error) {
      this.logger.error(`Error uploading file to S3: ${error.message}`);
      throw error;
    }
  }

  async upload(
    buffer: Buffer,
    options: UploadOptions,
  ): Promise<{ key: string; Location: string }> {
    const key = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucket,
          Body: buffer,
          Key: key,
          ContentType: options.contentType,
          Metadata: options.metadata,
          ACL: 'private',
          ServerSideEncryption: 'AES256',
        })
        .promise();

      this.logger.log(`File uploaded successfully to ${uploadResult.Location}`);

      return {
        key: uploadResult.Key,
        Location: uploadResult.Location,
      };
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${error.message}`);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();

      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file from S3: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();

      this.logger.log(`File ${key} deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting file from S3: ${error.message}`);
      throw error;
    }
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    try {
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucket,
        Key: key,
        Expires: expiresIn,
      });

      return url;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw error;
    }
  }
}