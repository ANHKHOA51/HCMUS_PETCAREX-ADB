const isValidDate = (date) => date instanceof Date && !Number.isNaN(date.getTime());

const asTrimmedStringOrNull = (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed === "" ? null : trimmed;
    }
    return null;
};

const ensureInRange = (name, value, min, max) => {
    if (!Number.isInteger(value) || value < min || value > max) {
        throw new Error(`Invalid ${name}: ${value}`);
    }
};

export const parseSqlDate = (value, fieldName = "date") => {
    if (value === undefined || value === null || value === "") return null;
    if (value instanceof Date) {
        if (!isValidDate(value)) throw new Error(`Invalid ${fieldName}`);
        return value;
    }

    const s = asTrimmedStringOrNull(value);
    if (!s) return null;

    const match = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
        throw new Error(`Invalid ${fieldName}. Expected YYYY-MM-DD`);
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    ensureInRange(`${fieldName} year`, year, 1, 9999);
    ensureInRange(`${fieldName} month`, month, 1, 12);
    ensureInRange(`${fieldName} day`, day, 1, 31);

    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() !== month - 1 ||
        date.getUTCDate() !== day
    ) {
        throw new Error(`Invalid ${fieldName}`);
    }

    return date;
};

export const parseSqlDateTime = (value, fieldName = "datetime") => {
    if (value === undefined || value === null || value === "") return null;
    if (value instanceof Date) {
        if (!isValidDate(value)) throw new Error(`Invalid ${fieldName}`);
        return value;
    }

    const s = asTrimmedStringOrNull(value);
    if (!s) return null;

    // Allow date-only input
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        return parseSqlDate(s, fieldName);
    }

    // ISO 8601 (recommended): 2025-12-31T23:59:59Z / with offset
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:?\d{2})$/.test(s)) {
        const date = new Date(s);
        if (!isValidDate(date)) throw new Error(`Invalid ${fieldName}`);
        return date;
    }

    // Common form: YYYY-MM-DD HH:mm[:ss[.sss]]
    const match = s.match(
        /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/
    );
    if (!match) {
        throw new Error(
            `Invalid ${fieldName}. Expected ISO (YYYY-MM-DDTHH:mm:ssZ) or YYYY-MM-DD HH:mm:ss`
        );
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    const second = match[6] === undefined ? 0 : Number(match[6]);
    const ms = match[7] === undefined ? 0 : Number(match[7].padEnd(3, "0"));

    ensureInRange(`${fieldName} year`, year, 1, 9999);
    ensureInRange(`${fieldName} month`, month, 1, 12);
    ensureInRange(`${fieldName} day`, day, 1, 31);
    ensureInRange(`${fieldName} hour`, hour, 0, 23);
    ensureInRange(`${fieldName} minute`, minute, 0, 59);
    ensureInRange(`${fieldName} second`, second, 0, 59);
    ensureInRange(`${fieldName} millisecond`, ms, 0, 999);

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, ms));
    if (!isValidDate(date)) throw new Error(`Invalid ${fieldName}`);
    return date;
};

export const parseSqlTime = (value, fieldName = "time") => {
    if (value === undefined || value === null || value === "") return null;
    if (value instanceof Date) {
        if (!isValidDate(value)) throw new Error(`Invalid ${fieldName}`);
        return value;
    }

    const s = asTrimmedStringOrNull(value);
    if (!s) return null;

    const match = s.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!match) {
        throw new Error(`Invalid ${fieldName}. Expected HH:mm or HH:mm:ss`);
    }

    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const second = match[3] === undefined ? 0 : Number(match[3]);

    ensureInRange(`${fieldName} hour`, hour, 0, 23);
    ensureInRange(`${fieldName} minute`, minute, 0, 59);
    ensureInRange(`${fieldName} second`, second, 0, 59);

    // For mssql Time, passing a Date is safest (driver extracts time portion)
    return new Date(Date.UTC(1970, 0, 1, hour, minute, second, 0));
};

export const timeFromEpoch = (value) => {
  const [datePart, timePart] = value.split(" ");
  if (!timePart) throw new Error("Invalid time format");

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  // SỬA TẠI ĐÂY:
  // Sử dụng Date.UTC để ép buộc giờ tạo ra là giờ UTC, không bị trừ 7 tiếng offset
  const d = new Date(Date.UTC(year, month - 1, day, hour, minute, second));

  if (isNaN(d.getTime())) throw new Error("Invalid time");
  
  return d;
};
