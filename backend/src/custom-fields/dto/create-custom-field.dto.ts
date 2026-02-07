import { FieldType } from '../entities/custom-field-definition.entity';

export class CreateCustomFieldDto {
    entity_type: string;
    field_name: string;
    label: string;
    field_type: FieldType;
    options?: string[];
    is_required?: boolean;
}
