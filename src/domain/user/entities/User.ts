import { FileImage } from '@domain/file/entities/FileImage';
import { IFileImageFormatOptions } from '@domain/file/entities/interfaces/IFileImageFormatOptions';

export const userImageFormat: IFileImageFormatOptions = {
  extension: 'png',
  sizes: [
    {
      height: 200,
      width: 200,
    },
    {
      height: 600,
      width: 600,
    },
    {
      height: 1200,
      width: 1200,
    },
  ],
  crop: 'center',
  destinationFolder: 'users/image',
};

export class User {
  id: string;
  order: string;
  name: string;
  level: string;
  email: string;
  image: { [key: string]: string };
  status: string;
  password: string;
  statement: string;
  location: string;
  activationToken?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user) {
    const imageFormatted = FileImage.getFormattedImageUrls({
      sizes: userImageFormat?.sizes,
      imageUrl: user?.image,
    });
    this.id = user?.id;
    this.order = user?.order;
    this.name = user?.name;
    this.level = user?.level;
    this.email = user?.email;
    this.image = imageFormatted;
    this.status = user?.status;
    this.statement = user?.statement;
    this.location = user?.location;
    this.password = user?.password;
    this.activationToken = user?.activationToken;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
  }
}
