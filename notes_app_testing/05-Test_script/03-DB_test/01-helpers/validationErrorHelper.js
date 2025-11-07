import { expect } from "@jest/globals";

/**
 * Verifies that the correct Mongoose validation error is thrown.
 * 
 * @param {Object} error - The error object caught by a try/catch block when a validation error occurs.
 * @param {string} field - The name of the field in the original data that caused the validation error.
 * @param {string} kind - The type of validation error (e.g., "required", "minLength", etc.).
 */
export function verifyValidationErrorCorrect(error, field, kind = "required") {
    
    expect(error).toBeDefined();
    expect(error.name).toEqual("ValidationError");

    const errorField = error.errors[field];
    expect(errorField.name).toEqual("ValidatorError");
    expect(errorField.kind).toEqual(kind);
    expect(errorField.path).toEqual(field);
}