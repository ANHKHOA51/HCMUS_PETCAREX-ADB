export const asNullIfEmpty = (value) => {
    if (value === undefined || value === null) return null;
    if (typeof value === "string" && value.trim() === "") return null;
    return value;
};

export const requireFields = (obj, fields) => {
    const missing = fields.filter((f) => obj?.[f] === undefined || obj?.[f] === null || obj?.[f] === "");
    return missing;
};