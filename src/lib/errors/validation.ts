import { createError, ErrorCode } from "./error-types"

export interface ValidationRule {
  validate: (value: any) => boolean | string // return true if valid, or error message
  message?: string
}

export interface ValidationSchema {
  [fieldName: string]: ValidationRule | ValidationRule[]
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Password validation
 */
export function isValidPassword(password: string): {
  valid: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  if (password.length < 8) {
    reasons.push("At least 8 characters")
  }
  if (!/[A-Z]/.test(password)) {
    reasons.push("At least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    reasons.push("At least one lowercase letter")
  }
  if (!/\d/.test(password)) {
    reasons.push("At least one number")
  }

  return {
    valid: reasons.length === 0,
    reasons,
  }
}

/**
 * Phone number validation (Vietnamese format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const vietnamPhoneRegex = /^(\+84|0)[1-9]\d{8,9}$/
  return vietnamPhoneRegex.test(phone)
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Required field validation
 */
export function isRequired(value: any): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

/**
 * Min length validation
 */
export function minLength(min: number): ValidationRule {
  return {
    validate: (value: string) =>
      (value && value.length >= min) ||
      `Minimum length is ${min} characters`,
    message: `Minimum length is ${min} characters`,
  }
}

/**
 * Max length validation
 */
export function maxLength(max: number): ValidationRule {
  return {
    validate: (value: string) =>
      (value && value.length <= max) ||
      `Maximum length is ${max} characters`,
    message: `Maximum length is ${max} characters`,
  }
}

/**
 * Match pattern validation
 */
export function pattern(regex: RegExp, message?: string): ValidationRule {
  return {
    validate: (value: string) =>
      (value && regex.test(value)) || message || "Invalid format",
    message: message || "Invalid format",
  }
}

/**
 * Validate form data against schema
 */
export function validateForm(
  data: Record<string, any>,
  schema: ValidationSchema
): ValidationResult {
  const errors: Record<string, string> = {}

  for (const fieldName in schema) {
    const rules = Array.isArray(schema[fieldName])
      ? schema[fieldName]
      : [schema[fieldName]]

    const fieldValue = data[fieldName]

    for (const rule of rules) {
      const result = rule.validate(fieldValue)

      if (result !== true) {
        errors[fieldName] = typeof result === "string" ? result : rule.message || "Invalid value"
        break // Stop at first error for this field
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Create validation rules object
 */
export const Rules = {
  required: () => ({
    validate: (value: any) =>
      isRequired(value) || "This field is required",
    message: "This field is required",
  }),
  email: () => ({
    validate: (value: string) =>
      (isRequired(value) && isValidEmail(value)) || "Invalid email address",
    message: "Invalid email address",
  }),
  password: () => ({
    validate: (value: string) => {
      if (!isRequired(value)) return "Password is required"
      const validation = isValidPassword(value)
      return validation.valid || `Password requirements: ${validation.reasons.join(", ")}`
    },
    message: "Password does not meet requirements",
  }),
  phone: () => ({
    validate: (value: string) =>
      (isRequired(value) && isValidPhoneNumber(value)) ||
      "Invalid phone number",
    message: "Invalid phone number",
  }),
  url: () => ({
    validate: (value: string) =>
      (isRequired(value) && isValidUrl(value)) || "Invalid URL",
    message: "Invalid URL",
  }),
  minLength,
  maxLength,
  pattern,
}

export default {
  validateForm,
  isValidEmail,
  isValidPassword,
  isValidPhoneNumber,
  isValidUrl,
  isRequired,
  Rules,
}
