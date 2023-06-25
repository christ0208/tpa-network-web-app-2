import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { BaseDto } from "src/common/dto/base-dto/base-dto";

/**
 * 
 * @param property 
 * @param validationOptions 
 * @returns function
 */
export function LengthEqual(property: number, validationOptions?: ValidationOptions): (object: BaseDto, propertyName: string) => void {
    return function (object: BaseDto, propertyName: string): void {
        registerDecorator({
            name: 'lengthEqual',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments): boolean {
                    const [relatedValue] = args.constraints;
                    return typeof value === 'string' && value.length === relatedValue;
                }
            }
        })
    }
}