import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  Validate,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  /*@Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)
  phone: string;*/

  @IsEmail()
  email: string;

  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
  })
  password: string;

  @MinLength(6)
  cf_password: string;
}
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
  })
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;
}
export class ChangePasswordDto {
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
  })
  oldPassword: string;
  @MinLength(6)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.',
  })
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;
}
