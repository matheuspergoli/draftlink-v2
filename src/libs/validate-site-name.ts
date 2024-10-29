const MIN_LENGTH = 3
const MAX_LENGTH = 30
const VALID_CHARACTERS = /^[a-zA-Z0-9_-]+$/

type ValidationResult = { isValid: true; error: null } | { isValid: false; error: string }

export const validateSiteName = (name: string): ValidationResult => {
	const trimmedName = name.trim()

	if (!trimmedName) {
		return { isValid: false, error: "Name cannot be empty" }
	}

	if (trimmedName.length < MIN_LENGTH) {
		return { isValid: false, error: `Name must be at least ${MIN_LENGTH} characters` }
	}

	if (trimmedName.length > MAX_LENGTH) {
		return { isValid: false, error: `Name must be at most ${MAX_LENGTH} characters` }
	}

	if (!VALID_CHARACTERS.test(trimmedName)) {
		return {
			isValid: false,
			error: "Name can only contain letters, numbers, underscores, and hyphens"
		}
	}

	if (
		trimmedName.startsWith("-") ||
		trimmedName.startsWith("_") ||
		trimmedName.endsWith("-") ||
		trimmedName.endsWith("_")
	) {
		return {
			isValid: false,
			error: "Name cannot start or end with an underscore or hyphen"
		}
	}

	if (
		trimmedName.includes("--") ||
		trimmedName.includes("__") ||
		trimmedName.includes("-_") ||
		trimmedName.includes("_-")
	) {
		return {
			isValid: false,
			error: "Name cannot contain consecutive underscores or hyphens"
		}
	}

	return { isValid: true, error: null }
}
