import { UserRegisterDto } from '../dto/user-register.dto';

import { UserLoginDto } from '../dto/user-login.dto';
import { UserModalType } from '../types';

export interface IUserService {
	createUser: (dto: UserRegisterDto) => Promise<UserModalType | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
