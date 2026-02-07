export class CreateEmployeeDto {
    user_id: string; // UUID of the user account
    nik: string;
    full_name: string;
    department_id?: number;
    join_date: string; // ISO Date
    salary_base: number;
    custom_attributes?: Record<string, any>;
}
