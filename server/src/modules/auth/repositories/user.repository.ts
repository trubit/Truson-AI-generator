import { UserModel, IUserDocument } from '../models/user.model';
import { RegisterDTO } from '../../../../../shared/index';

export class UserRepository {
  public async findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password');
  }

  public async findByUsername(username: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ username: username.toLowerCase() }).select('+password');
  }

  public async findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id);
  }

  public async create(data: RegisterDTO & { passwordHash: string }): Promise<IUserDocument> {
    return UserModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      password: data.passwordHash,
      status: 'INACTIVE', // Activated upon email verification
      isEmailVerified: false,
    });
  }

  public async update(id: string, updates: Partial<IUserDocument>): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { $set: updates }, { new: true });
  }
}

export const userRepository = new UserRepository();
