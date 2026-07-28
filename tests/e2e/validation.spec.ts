import { expect, test } from "@playwright/test";
import { loginSchema } from "../../lib/validation/login.schema";
import { registerSchema } from "../../lib/validation/register.schema";

test.describe("registration validation", () => {
  const base = {
    fullName: "Maya Student",
    email: "maya@example.test",
    password: "secret1",
    confirmPassword: "secret1",
  };

  const cases: Array<[string, Record<string, unknown>, boolean]> = [
    ["standard registration", base, true],
    ["two-character name", { ...base, fullName: "Al" }, true],
    ["trimmed name", { ...base, fullName: "  Maya  " }, true],
    ["empty name", { ...base, fullName: "" }, false],
    ["space-only name", { ...base, fullName: "   " }, false],
    ["one-character name", { ...base, fullName: "M" }, false],
    ["missing name", { ...base, fullName: undefined }, false],
    ["plus-address email", { ...base, email: "maya+market@example.test" }, true],
    ["subdomain email", { ...base, email: "maya@mail.example.test" }, true],
    ["trimmed email", { ...base, email: "  maya@example.test  " }, true],
    ["empty email", { ...base, email: "" }, false],
    ["email without at-sign", { ...base, email: "maya.example.test" }, false],
    ["email without domain", { ...base, email: "maya@" }, false],
    ["email without local part", { ...base, email: "@example.test" }, false],
    ["email containing spaces", { ...base, email: "ma ya@example.test" }, false],
    ["six-character password", { ...base, password: "123456", confirmPassword: "123456" }, true],
    ["long password", { ...base, password: "x".repeat(128), confirmPassword: "x".repeat(128) }, true],
    ["empty password", { ...base, password: "", confirmPassword: "" }, false],
    ["five-character password", { ...base, password: "12345", confirmPassword: "12345" }, false],
    ["missing password", { ...base, password: undefined }, false],
    ["empty confirmation", { ...base, confirmPassword: "" }, false],
    ["short confirmation", { ...base, confirmPassword: "12345" }, false],
    ["different confirmation", { ...base, confirmPassword: "secret2" }, false],
    ["case-different confirmation", { ...base, confirmPassword: "Secret1" }, false],
    ["numeric name rejected", { ...base, fullName: 123 }, false],
    ["numeric email rejected", { ...base, email: 123 }, false],
    ["numeric password rejected", { ...base, password: 123456, confirmPassword: 123456 }, false],
    ["null input fields rejected", { fullName: null, email: null, password: null, confirmPassword: null }, false],
  ];

  for (const [name, input, expected] of cases) {
    test(name, () => {
      expect(registerSchema.safeParse(input).success).toBe(expected);
    });
  }
});

test.describe("login validation", () => {
  const cases: Array<[string, Record<string, unknown>, boolean]> = [
    ["standard login", { email: "maya@example.test", password: "secret1" }, true],
    ["one-character password", { email: "maya@example.test", password: "x" }, true],
    ["long password", { email: "maya@example.test", password: "x".repeat(256) }, true],
    ["trimmed email", { email: "  maya@example.test  ", password: "secret1" }, true],
    ["plus-address email", { email: "maya+cart@example.test", password: "secret1" }, true],
    ["subdomain email", { email: "maya@mail.example.test", password: "secret1" }, true],
    ["empty body", {}, false],
    ["missing email", { password: "secret1" }, false],
    ["empty email", { email: "", password: "secret1" }, false],
    ["space-only email", { email: "   ", password: "secret1" }, false],
    ["email without at-sign", { email: "maya.example.test", password: "secret1" }, false],
    ["email without local part", { email: "@example.test", password: "secret1" }, false],
    ["email without domain", { email: "maya@", password: "secret1" }, false],
    ["email containing spaces", { email: "ma ya@example.test", password: "secret1" }, false],
    ["missing password", { email: "maya@example.test" }, false],
    ["empty password", { email: "maya@example.test", password: "" }, false],
    ["numeric email", { email: 123, password: "secret1" }, false],
    ["numeric password", { email: "maya@example.test", password: 123 }, false],
  ];

  for (const [name, input, expected] of cases) {
    test(name, () => {
      expect(loginSchema.safeParse(input).success).toBe(expected);
    });
  }
});
