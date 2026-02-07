export class CreateUserDto {
    email: string;
    fullName: string;
    passwordHash: string;
    role: 'ADMIN' | 'MANAGER' | 'USER';
}
