import { UserRegisterDto } from '../dto/user-register.dto';

import { UserLoginDto } from '../dto/user-login.dto';
import { UserModelType } from '../types';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModelType | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
	getUserInfo: (email: string) => Promise<UserModelType | null>;
}
