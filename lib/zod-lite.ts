type ParseResult<T> = { success: true; data: T } | { success: false };

class StringSchema {
  private minLength = 0;
  private requiresEmail = false;

  min(length: number) {
    this.minLength = length;
    return this;
  }

  email() {
    this.requiresEmail = true;
    return this;
  }

  parse(value: unknown) {
    if (typeof value !== "string" || value.trim().length < this.minLength) return undefined;
    if (this.requiresEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return undefined;
    return value.trim();
  }
}

class ObjectSchema<TShape extends Record<string, StringSchema>> {
  constructor(private shape: TShape) {}

  safeParse(value: unknown): ParseResult<{ [K in keyof TShape]: string }> {
    if (!value || typeof value !== "object") return { success: false };
    const source = value as Record<string, unknown>;
    const data = {} as { [K in keyof TShape]: string };

    for (const key in this.shape) {
      const parsed = this.shape[key].parse(source[key]);
      if (!parsed) return { success: false };
      data[key] = parsed;
    }

    return { success: true, data };
  }
}

export const z = {
  string: () => new StringSchema(),
  object: <TShape extends Record<string, StringSchema>>(shape: TShape) => new ObjectSchema(shape),
};
