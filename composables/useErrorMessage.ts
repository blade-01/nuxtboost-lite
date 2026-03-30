const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const normalizeString = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const message = value.trim();
  return message ? message : null;
};

const readMessage = (value: unknown): string | null => {
  const directMessage = normalizeString(value);

  if (directMessage) {
    return directMessage;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = readMessage(item);

      if (message) {
        return message;
      }
    }

    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const candidates = [
    value.message,
    value.statusMessage,
    value.error,
    value.data,
    value.response,
    value.errors,
    value.cause,
  ];

  for (const candidate of candidates) {
    const message = readMessage(candidate);

    if (message) {
      return message;
    }
  }

  return null;
};

export default function () {
  const getErrorMessage = (
    error: unknown,
    fallback = "Something went wrong. Please try again.",
  ) => {
    return readMessage(error) || fallback;
  };

  return {
    getErrorMessage,
  };
}
