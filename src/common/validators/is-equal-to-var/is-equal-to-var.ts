import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { BaseDto } from "src/common/dto/base-dto/base-dto";

export function IsEqualToVar(property: string, validationOptions?: ValidationOptions): (object: BaseDto, propertyName: string) => void {
    return function (object: BaseDto, propertyName: string): void {
        registerDecorator({
            name: 'lengthEqual',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return typeof value === 'string' && typeof relatedValue === 'string' && value === relatedValue;
                }
            }
        })
    }
}
