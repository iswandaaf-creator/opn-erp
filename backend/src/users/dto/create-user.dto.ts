export class CreateUserDto {
    username: string;
    email: string;
    password_hash: string;
    role_id: number;
}
