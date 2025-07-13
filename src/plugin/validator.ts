interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: { [key: string]: string };
    errorMsg?: string;
}

export interface ValidationSchema {
    [key: string]: {
        required?: boolean;
        type: 'string' | 'number' | 'email' | 'password' | 'array' | 'boolean' | 'datetime' | 'enum' | 'url' | 'integer';
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: RegExp;
        displayName?: string;
        minDate?: string | Date;
        maxDate?: string | Date;
        isValidDate?: boolean;
        enumValues?: string[];
    };
}

// ฟังก์ชันตรวจสอบข้อมูล
export function validateInput<T extends object>(input: T, schema: ValidationSchema): ValidationResult<T> {
    try {
        const errors: { [key: string]: string } = {};
        const validatedData: { [key: string]: any } = {};

        for (const [key, rules] of Object.entries(schema)) {
            const value = input[key as keyof T];
            const displayName = rules.displayName || key;

            // ตรวจสอบ required
            if (rules.required && (value === undefined || value === null)) {
                errors[key] = `${displayName} จำเป็นต้องกรอก`;
                continue;
            }

            // ข้ามถ้าไม่ required และค่าเป็น undefined/null
            if (!rules.required && (value === undefined || value === null)) {
                validatedData[key] = value;
                continue;
            }

            // ตรวจสอบประเภทข้อมูล
            switch (rules.type) {
                case 'string':
                    if (typeof value !== 'string') {
                        errors[key] = `${displayName} ต้องเป็นข้อความ`;
                        continue;
                    }
                    break;
                case 'number':
                    if (typeof value !== 'number' || isNaN(value)) {
                        errors[key] = `${displayName} ต้องเป็นตัวเลข`;
                        continue;
                    }
                    // ตรวจสอบ min/max สำหรับ number
                    if (rules.min !== undefined && value < rules.min) {
                        errors[key] = `${displayName} ต้องมีค่าอย่างน้อย ${rules.min}`;
                        continue;
                    }
                    if (rules.max !== undefined && value > rules.max) {
                        errors[key] = `${displayName} ต้องมีค่าไม่เกิน ${rules.max}`;
                        continue;
                    }
                    break;
                case 'boolean':
                    if (typeof value !== 'boolean') {
                        errors[key] = `${displayName} ต้องเป็นค่า true หรือ false`;
                        continue;
                    }
                    break;
                case 'array':
                    if (!Array.isArray(value)) {
                        errors[key] = `${displayName} ต้องเป็นอาร์เรย์`;
                        continue;
                    }
                    break;
                case 'email':
                    if (typeof value !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors[key] = `${displayName} ต้องเป็นอีเมลที่ถูกต้อง`;
                        continue;
                    }
                    break;
                case 'password':
                    if (typeof value !== 'string') {
                        errors[key] = `${displayName} ต้องเป็นข้อความ`;
                        continue;
                    }
                    // เพิ่มการตรวจสอบรหัสผ่าน เช่น ความยาวขั้นต่ำและแพทเทิร์น
                    if (rules.minLength && value.length < rules.minLength) {
                        errors[key] = `${displayName} ต้องมีความยาวอย่างน้อย ${rules.minLength} ตัวอักษร`;
                        continue;
                    }
                    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(value)) {
                        errors[key] = `${displayName} ต้องมีตัวอักษรพิมพ์เล็ก พิมพ์ใหญ่ และตัวเลข`;
                        continue;
                    }
                    break;
                case 'datetime':
                    try {
                        if (typeof value !== 'string' && !(value instanceof Date)) {
                            errors[key] = `${displayName} ต้องเป็นวันที่ (string หรือ Date object)`;
                            continue;
                        }
                        const dateValue = typeof value === 'string' ? new Date(value) : value;
                        if (rules.isValidDate && isNaN(dateValue.getTime())) {
                            errors[key] = `${displayName} ต้องเป็นวันที่ที่ถูกต้อง`;
                            continue;
                        }
                        if (rules.minDate) {
                            const minDate = typeof rules.minDate === 'string' ? new Date(rules.minDate) : rules.minDate;
                            if (isNaN(minDate.getTime())) {
                                throw new Error(`Invalid minDate for ${displayName}`);
                            }
                            if (dateValue < minDate) {
                                errors[key] = `${displayName} ต้องไม่เร็วกว่า ${minDate.toISOString()}`;
                                continue;
                            }
                        }
                        if (rules.maxDate) {
                            const maxDate = typeof rules.maxDate === 'string' ? new Date(rules.maxDate) : rules.maxDate;
                            if (isNaN(maxDate.getTime())) {
                                throw new Error(`Invalid maxDate for ${displayName}`);
                            }
                            if (dateValue > maxDate) {
                                errors[key] = `${displayName} ต้องไม่ช้ากว่า ${maxDate.toISOString()}`;
                                continue;
                            }
                        }
                        validatedData[key] = dateValue;
                    } catch (error: any) {
                        errors[key] = `${displayName} มีข้อผิดพลาดในการประมวลผลวันที่: ${error.message}`;
                        continue;
                    }
                    break;
                case 'enum':
                    if (typeof value !== 'string' || !rules.enumValues?.includes(value)) {
                        errors[key] = `${displayName} ต้องเป็นหนึ่งใน: ${rules.enumValues?.join(', ')}`;
                        continue;
                    }
                    break;
                case 'url':
                    if (typeof value !== 'string' || !/^(https?:\/\/)[^\s/$.?#].[^\s]*$/.test(value)) {
                        errors[key] = `${displayName} ต้องเป็น URL ที่ถูกต้อง`;
                        continue;
                    }
                    break;
                case 'integer':
                    if (typeof value !== 'number' || !Number.isInteger(value)) {
                        errors[key] = `${displayName} ต้องเป็นจำนวนเต็ม`;
                        continue;
                    }
                    // ตรวจสอบ min/max สำหรับ integer
                    if (rules.min !== undefined && value < rules.min) {
                        errors[key] = `${displayName} ต้องมีค่าอย่างน้อย ${rules.min}`;
                        continue;
                    }
                    if (rules.max !== undefined && value > rules.max) {
                        errors[key] = `${displayName} ต้องมีค่าไม่เกิน ${rules.max}`;
                        continue;
                    }
                    break;
                default:
                    errors[key] = `${displayName} มีประเภทข้อมูลที่ไม่รองรับ: ${rules.type}`;
                    continue;
            }

            // ตรวจสอบความยาว (สำหรับ string, email, password, url, array)
            if ((rules.type === 'string' || rules.type === 'email' || rules.type === 'password' || rules.type === 'url') && typeof value === 'string') {
                if (rules.minLength && value.length < rules.minLength) {
                    errors[key] = `${displayName} ต้องมีความยาวอย่างน้อย ${rules.minLength} ตัวอักษร`;
                    continue;
                }
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors[key] = `${displayName} ต้องมีความยาวไม่เกิน ${rules.maxLength} ตัวอักษร`;
                    continue;
                }
            } else if (rules.type === 'array' && Array.isArray(value)) {
                if (rules.minLength && value.length < rules.minLength) {
                    errors[key] = `${displayName} ต้องมีอย่างน้อย ${rules.minLength} รายการ`;
                    continue;
                }
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors[key] = `${displayName} ต้องมีไม่เกิน ${rules.maxLength} รายการ`;
                    continue;
                }
            }

            // ตรวจสอบ pattern
            if (rules.pattern && (rules.type === 'string' || rules.type === 'email' || rules.type === 'password' || rules.type === 'url') && typeof value === 'string') {
                if (!rules.pattern.test(value)) {
                    errors[key] = `${displayName} ไม่ตรงตามรูปแบบที่กำหนด`;
                    continue;
                }
            }

            if (rules.type !== 'datetime') {
                validatedData[key] = value;
            }
        }

        if (Object.keys(errors).length > 0) {
            const errorMsg = Object.entries(errors)
                .map(([key, error]) => error)
                .join('\n');
            return { success: false, errors, errorMsg };
        }

        return { success: true, data: validatedData as T };
    } catch (error: any) {
        return {
            success: false,
            errorMsg: `เกิดข้อผิดพลาดในการตรวจสอบข้อมูล: ${error.message}`,
            errors: { general: error.message },
        };
    }
}