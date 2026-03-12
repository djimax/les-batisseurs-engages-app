import { describe, it, expect } from "vitest";
import {
  formatMontant,
  displayMontant,
  validateDateRange,
  calculateOffset,
  createPaginatedResponse,
  generateSlug,
  isDateInPast,
  isDateToday,
  daysBetween,
  isCotisationOverdue,
  isCotisationExpiringSoon,
  formatDate,
} from "./helpers";

describe("Helpers", () => {
  describe("formatMontant", () => {
    it("should format number to 2 decimal places", () => {
      expect(formatMontant(10.5)).toBe(10.5);
      expect(formatMontant(10.555)).toBe(10.56);
      expect(formatMontant(10)).toBe(10);
    });

    it("should parse string to number", () => {
      expect(formatMontant("10.5")).toBe(10.5);
      expect(formatMontant("10")).toBe(10);
    });

    it("should throw on invalid input", () => {
      expect(() => formatMontant("invalid")).toThrow();
      expect(() => formatMontant(NaN)).toThrow();
    });
  });

  describe("displayMontant", () => {
    it("should format with currency symbol", () => {
      expect(displayMontant(10.5)).toBe("10.50 F");
      expect(displayMontant(10.5, "€")).toBe("10.50 €");
    });
  });

  describe("validateDateRange", () => {
    it("should not throw for valid date range", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-12-31");
      expect(() => validateDateRange(start, end)).not.toThrow();
    });

    it("should throw for invalid date range", () => {
      const start = new Date("2024-12-31");
      const end = new Date("2024-01-01");
      expect(() => validateDateRange(start, end)).toThrow();
    });

    it("should throw when dates are equal", () => {
      const date = new Date("2024-01-01");
      expect(() => validateDateRange(date, date)).toThrow();
    });
  });

  describe("calculateOffset", () => {
    it("should calculate offset correctly", () => {
      expect(calculateOffset(1, 10)).toBe(0);
      expect(calculateOffset(2, 10)).toBe(10);
      expect(calculateOffset(3, 10)).toBe(20);
    });

    it("should throw for invalid page", () => {
      expect(() => calculateOffset(0, 10)).toThrow();
      expect(() => calculateOffset(-1, 10)).toThrow();
    });
  });

  describe("createPaginatedResponse", () => {
    it("should create paginated response", () => {
      const items = [1, 2, 3];
      const response = createPaginatedResponse(items, 100, 10, 0);
      expect(response.items).toEqual(items);
      expect(response.total).toBe(100);
      expect(response.limit).toBe(10);
      expect(response.offset).toBe(0);
      expect(response.hasMore).toBe(true);
    });

    it("should indicate no more items", () => {
      const response = createPaginatedResponse([1, 2], 12, 10, 10);
      expect(response.hasMore).toBe(false);
    });
  });

  describe("generateSlug", () => {
    it("should generate slug from text", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
      expect(generateSlug("Test@123")).toBe("test123");
      expect(generateSlug("  Multiple   Spaces  ")).toBe("multiple-spaces");
    });
  });

  describe("isDateInPast", () => {
    it("should detect past dates", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isDateInPast(pastDate)).toBe(true);
    });

    it("should detect future dates", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isDateInPast(futureDate)).toBe(false);
    });
  });

  describe("isDateToday", () => {
    it("should detect today's date", () => {
      expect(isDateToday(new Date())).toBe(true);
    });

    it("should detect other dates", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isDateToday(tomorrow)).toBe(false);
    });
  });

  describe("daysBetween", () => {
    it("should calculate days between dates", () => {
      const start = new Date("2024-01-01");
      const end = new Date("2024-01-11");
      expect(daysBetween(start, end)).toBe(10);
    });

    it("should work with string dates", () => {
      expect(daysBetween("2024-01-01", "2024-01-11")).toBe(10);
    });
  });

  describe("isCotisationOverdue", () => {
    it("should detect overdue cotisations", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      expect(isCotisationOverdue(pastDate)).toBe(true);
    });

    it("should detect non-overdue cotisations", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      expect(isCotisationOverdue(futureDate)).toBe(false);
    });
  });

  describe("isCotisationExpiringSoon", () => {
    it("should detect cotisations expiring soon", () => {
      const soonDate = new Date();
      soonDate.setDate(soonDate.getDate() + 15);
      expect(isCotisationExpiringSoon(soonDate, 30)).toBe(true);
    });

    it("should detect cotisations not expiring soon", () => {
      const laterDate = new Date();
      laterDate.setDate(laterDate.getDate() + 60);
      expect(isCotisationExpiringSoon(laterDate, 30)).toBe(false);
    });
  });

  describe("formatDate", () => {
    it("should format date for display", () => {
      const date = new Date("2024-01-15");
      const formatted = formatDate(date, "en-US");
      expect(formatted).toContain("1");
      expect(formatted).toContain("2024");
    });
  });
});
