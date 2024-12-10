import { Injectable, HttpException, HttpStatus, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './users/services/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { hash } from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}



  async register(createUserDto: any) {
    
    const existingUser = await this.userService.findOneByUsername(createUserDto.username);
    if (existingUser) {
      return { statusCode: 205, message:'User already exists'};
    }

    const existingEmail = await this.userService.findOneByEmail(createUserDto.email);
    if (existingEmail) {
      return { statusCode: 205, message: 'User already exists'};
    }

    // Hash the password before saving the user
    const hashedPassword = await hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    try {
      // Create the user
      
      const user = await this.userService.create(createUserDto);

      // Generate JWT payload
      const payload: JwtPayload = { sub: user?.id, username: user.username };

      // Return JWT token and user info (excluding password)
      return {
        statusCode: 200,
        message: "Account creation successful",
        access_token: this.jwtService.sign(payload),
        user: { ...user, password: undefined },
      };
    } catch (error) {
      return { statusCode: 205, message: error.message };
      // throw new InternalServerErrorException('Failed to register user');
    }
  }
  
  // Validate user credentials for login
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmailOrPhone(username);
    
    if (user && await bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Login user
  
  async login(user: any) {
    const payload: JwtPayload = { sub: user._id, username: user.username };
    delete user.password;
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }

  async forgotPassword(email: string) {
  const user = await this.userService.findOneByEmail(email);
  if (!user) {
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
  console.log(user);

  const plainResetToken = this.generateResetToken();
  const hashedResetToken = crypto.createHash('sha256').update(plainResetToken).digest('hex');
  
  // Save hashed token and expiration to user record
  console.log("djd")
  let done = await this.userService.saveResetPasswordToken(user._id, hashedResetToken);

  // Normally, send the plain token via email, not the hashed version
  // Example: await this.mailService.sendResetPasswordEmail(user.email, plainResetToken);
  console.log("xx")
  return { resetToken: plainResetToken, data: user };


}

  async resetPassword({ token, newPassword }: { token: string; newPassword: string }) {
    try {
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      console.log(hashedToken)
      const user = await this.userService.findOneByResetPasswordToken(hashedToken);
      console.log(user.firstName)    
      if (!user || user.resetPasswordTokenExpiry < new Date()) {
        return { statusCode: 500, message: 'Invalid or expired reset token'}
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      let update = await this.userService.updatePassword(user._id, hashedPassword);
      
      // Clear reset token and expiry after password change
      await this.userService.clearResetPasswordToken(user._id);
  
      return { statusCode: 200, message: 'Password reset successfully', data: { email: user.email, firstName: user.firstName } };
    } catch (error) {
      console.error('Error during password reset:', error);
      return { statusCode: 500, message: 'Invalid or expired reset token'}
  
    }
  }
  
  // Change password (authenticated user)
  async changePassword({ userId, oldPassword, newPassword }: { userId: string, oldPassword: string, newPassword: string }) {
    const user = await this.userService.findOne(userId);
    
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new HttpException('Invalid old password', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updatePassword(userId, hashedPassword);

    return { statusCode: 200, message: 'Password changed successfully', data: { email: user.email, firstName: user.firstName } };
  }

  // Set password for a new account
  async setPassword({ userId, password }: { userId: string, password: string }) {
    // No hashing password, directly generate JWT token for password setting
    const payload: JwtPayload = { sub: userId, username: password };
    const accessToken = this.jwtService.sign(payload);

    // Directly store the token instead of a hashed password
    await this.userService.updatePassword(userId, accessToken);

    return { message: 'Password set successfully' };
  }


  // Generate a random reset token
  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash the reset token
  // private async hashResetToken(token: string): Promise<string> {
  //   return bcrypt.hash(token, 10);
  // }
}
