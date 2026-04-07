export type PasswordChecks = {
  minLength: boolean;
  hasSpecial: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
};

const SPECIAL_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    hasSpecial: SPECIAL_RE.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
  };
}

export function passwordMeetsPolicy(checks: PasswordChecks): boolean {
  return (
    checks.minLength &&
    checks.hasSpecial &&
    checks.hasUpper &&
    checks.hasNumber
  );
}

export function passwordStrengthLabel(checks: PasswordChecks): string {
  const n = Object.values(checks).filter(Boolean).length;
  if (n <= 1) return "Weak";
  if (n === 2) return "Fair";
  if (n === 3) return "Good";
  return "Strong";
}
