import { hash } from 'bcryptjs';

export class User {
	private _password: string;

	constructor(private _email: string, private _name: string) {}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	async setPassword(pass: string): Promise<void> {
		this._password = await hash(pass, 10);
	}
}
