import dayjs from "dayjs";
import type { LocationQueryValue } from "vue-router";

type RouteQueryValue = LocationQueryValue | LocationQueryValue[] | undefined;
type MaybeSchemaInput<TSchema> =
  | TSchema
  | Ref<TSchema>
  | ComputedRef<TSchema>
  | (() => TSchema);

export type FilterFieldType =
  | "text"
  | "select"
  | "date"
  | "date-range"
  | "switch"
  | "number"
  | "custom";

export type UrlDateRange = {
  from: string;
  to: string;
};

export type FilterSchemaItem<TValue> = {
  type?: FilterFieldType;
  default: TValue;
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: unknown }> | string[] | number[];
  component?: unknown;
  props?: Record<string, unknown>;
  parse?: (value: RouteQueryValue) => TValue;
  serialize?: (value: TValue, defaultValue: TValue) => string | undefined;
  toUI?: (value: TValue) => unknown;
  fromUI?: (value: unknown) => TValue;
  query?:
    | string
    | ((
        value: TValue,
        filters: Record<string, unknown>,
      ) => Record<string, unknown> | undefined);
  oneOf?: TValue[];
  min?: TValue extends number ? number : never;
  max?: TValue extends number ? number : never;
  showInFilterPanel?: boolean;
};

export type FilterSchema = Record<string, FilterSchemaItem<any>>;

export type FilterField = {
  key: string;
  type: FilterFieldType;
  label?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: unknown }> | string[] | number[];
  component?: unknown;
  props?: Record<string, unknown>;
};

type FilterSchemaEntry<TValue> = TValue | FilterSchemaItem<TValue>;

type WidenPrimitive<TValue> = TValue extends string
  ? string
  : TValue extends number
    ? number
    : TValue extends boolean
      ? boolean
      : TValue;

type InferFilterValue<TEntry> =
  TEntry extends FilterSchemaItem<infer TValue>
    ? TValue
    : WidenPrimitive<TEntry>;

type FilterValues<TSchema extends Record<string, FilterSchemaEntry<any>>> = {
  [K in keyof TSchema]: InferFilterValue<TSchema[K]>;
};

type FilterRefs<TSchema extends Record<string, FilterSchemaEntry<any>>> = {
  [K in keyof TSchema]: Ref<FilterValues<TSchema>[K]>;
};

type NormalizedSchema<TSchema extends Record<string, FilterSchemaEntry<any>>> =
  {
    [K in keyof TSchema]: FilterSchemaItem<FilterValues<TSchema>[K]> & {
      type: FilterFieldType;
    };
  };

type UseUrlFiltersOptions = {
  mode?: "auto" | "manual";
};

function normalizeQueryValue(value: RouteQueryValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0] ?? undefined;
  }

  return value ?? undefined;
}

function inferFieldType(value: unknown): FilterFieldType {
  if (typeof value === "boolean") {
    return "switch";
  }

  if (typeof value === "number") {
    return "number";
  }

  if (value && typeof value === "object" && "from" in value && "to" in value) {
    return "date-range";
  }

  return "text";
}

function isSchemaItem<TValue>(
  value: FilterSchemaEntry<TValue>,
): value is FilterSchemaItem<TValue> {
  return !!value && typeof value === "object" && "default" in value;
}

function cloneFilterValue<TValue>(value: TValue): TValue {
  if (value && typeof value === "object") {
    if (typeof structuredClone === "function") {
      return structuredClone(value);
    }

    return JSON.parse(JSON.stringify(value)) as TValue;
  }

  return value;
}

function normalizeSchema<
  TSchema extends Record<string, FilterSchemaEntry<any>>,
>(schema: TSchema): NormalizedSchema<TSchema> {
  return Object.keys(schema).reduce((acc, key) => {
    const typedKey = key as keyof TSchema;
    const entry = schema[typedKey];

    if (isSchemaItem(entry)) {
      acc[typedKey] = {
        showInFilterPanel: true,
        ...entry,
        type: entry.type ?? inferFieldType(entry.default),
      } as unknown as NormalizedSchema<TSchema>[typeof typedKey];
      return acc;
    }

    acc[typedKey] = {
      type: inferFieldType(entry),
      default: entry,
      showInFilterPanel: true,
    } as NormalizedSchema<TSchema>[typeof typedKey];

    return acc;
  }, {} as NormalizedSchema<TSchema>);
}

function parsePrimitiveValue<TValue>(
  value: RouteQueryValue,
  defaultValue: TValue,
): TValue {
  const normalizedValue = normalizeQueryValue(value);

  if (normalizedValue === undefined) {
    return cloneFilterValue(defaultValue);
  }

  if (typeof defaultValue === "number") {
    const parsedValue = Number(normalizedValue);
    return (Number.isNaN(parsedValue) ? defaultValue : parsedValue) as TValue;
  }

  if (typeof defaultValue === "boolean") {
    return (normalizedValue === "true" || normalizedValue === "1") as TValue;
  }

  if (typeof defaultValue === "string") {
    return normalizedValue as TValue;
  }

  return cloneFilterValue(defaultValue);
}

function applyFilterRules<TValue>(
  value: TValue,
  item: FilterSchemaItem<TValue>,
): TValue {
  if (item.oneOf?.length && !item.oneOf.includes(value)) {
    return cloneFilterValue(item.default);
  }

  if (typeof value === "number") {
    if (typeof item.min === "number" && value < item.min) {
      return cloneFilterValue(item.default);
    }

    if (typeof item.max === "number" && value > item.max) {
      return cloneFilterValue(item.default);
    }
  }

  return value;
}

function defaultSerialize<TValue>(
  value: TValue,
  defaultValue: TValue,
): string | undefined {
  if (value === defaultValue) {
    return undefined;
  }

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "string" && !value) {
    return undefined;
  }

  if (typeof value === "object") {
    return undefined;
  }

  return String(value);
}

function isSameValue(left: unknown, right: unknown) {
  if (left === right) {
    return true;
  }

  if (left && right && typeof left === "object" && typeof right === "object") {
    return JSON.stringify(left) === JSON.stringify(right);
  }

  return false;
}

function isSameQuery(
  left: Record<string, string | undefined>,
  right: Record<string, RouteQueryValue>,
): boolean {
  const leftKeys = Object.keys(left)
    .filter((key) => left[key] !== undefined)
    .sort();
  const rightKeys = Object.keys(right)
    .filter((key) => normalizeQueryValue(right[key]) !== undefined)
    .sort();

  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  return leftKeys.every((key, index) => {
    const rightKey = rightKeys[index];
    return (
      key === rightKey && left[key] === normalizeQueryValue(right[rightKey])
    );
  });
}

function buildUrlFromQuery(
  path: string,
  query: Record<string, RouteQueryValue>,
) {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    const normalizedValue = normalizeQueryValue(value);

    if (normalizedValue !== undefined) {
      searchParams.set(key, normalizedValue);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

function cleanApiQuery(query: Record<string, unknown>) {
  return Object.entries(query).reduce(
    (acc, [key, value]) => {
      if (value === undefined || value === null) {
        return acc;
      }

      if (typeof value === "string" && !value.trim()) {
        return acc;
      }

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        !Object.keys(value).length
      ) {
        return acc;
      }

      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

function defaultFromUI<TValue>(
  item: FilterSchemaItem<TValue>,
  value: unknown,
): TValue {
  if (item.type === "number" || typeof item.default === "number") {
    if (value === "" || value === undefined || value === null) {
      return cloneFilterValue(item.default);
    }

    const parsedValue = Number(value);
    return (Number.isNaN(parsedValue) ? item.default : parsedValue) as TValue;
  }

  if (item.type === "switch") {
    return Boolean(value) as TValue;
  }

  return value as TValue;
}

export function createDateRangeFilter(options?: {
  label?: string;
  queryKeys?: {
    from?: string;
    to?: string;
  };
  defaultValue?: UrlDateRange;
  separator?: string;
  showInFilterPanel?: boolean;
  props?: Record<string, unknown>;
}) {
  const defaultValue = options?.defaultValue ?? {
    from: "",
    to: "",
  };
  const separator = options?.separator ?? ",";

  return {
    type: "date-range" as const,
    default: defaultValue,
    label: options?.label,
    props: options?.props,
    showInFilterPanel: options?.showInFilterPanel ?? true,
    parse: (value: RouteQueryValue): UrlDateRange => {
      const normalizedValue = normalizeQueryValue(value);

      if (!normalizedValue) {
        return cloneFilterValue(defaultValue);
      }

      const [from = "", to = ""] = normalizedValue.split(separator);
      return { from, to };
    },
    serialize: (value: UrlDateRange, fallback: UrlDateRange) => {
      const from = value?.from ?? "";
      const to = value?.to ?? "";

      if (from === (fallback?.from ?? "") && to === (fallback?.to ?? "")) {
        return undefined;
      }

      if (!from && !to) {
        return undefined;
      }

      return `${from}${separator}${to}`;
    },
    toUI: (value: UrlDateRange) => {
      if (!value?.from && !value?.to) {
        return null;
      }

      return [
        value?.from ? dayjs(value.from).toDate() : null,
        value?.to ? dayjs(value.to).toDate() : null,
      ];
    },
    fromUI: (value: unknown): UrlDateRange => {
      const range = Array.isArray(value) ? value : [];

      return {
        from: range[0] ? dayjs(range[0]).format("YYYY-MM-DD") : "",
        to: range[1] ? dayjs(range[1]).format("YYYY-MM-DD") : "",
      };
    },
    query: (value: UrlDateRange) =>
      cleanApiQuery({
        [options?.queryKeys?.from ?? "from"]: value?.from,
        [options?.queryKeys?.to ?? "to"]: value?.to,
      }),
  } satisfies FilterSchemaItem<UrlDateRange>;
}

export default function useUrlFilters<
  TSchema extends Record<string, FilterSchemaEntry<any>>,
>(
  schemaInput: MaybeSchemaInput<TSchema>,
  options?: UseUrlFiltersOptions,
): {
  filters: FilterRefs<TSchema>;
  filterModel: WritableComputedRef<Record<string, unknown>>;
  fields: ComputedRef<FilterField[]>;
  applyFilters: () => Promise<void>;
  resetFilters: () => Promise<void>;
  apiQuery: ComputedRef<Record<string, unknown>>;
  shareUrl: ComputedRef<string>;
} {
  const route = useRoute();
  const router = useRouter();
  const mode = options?.mode ?? "auto";
  const resolvedSchema = computed(() => normalizeSchema(toValue(schemaInput)));

  const createValue = <K extends keyof TSchema>(
    key: K,
    query: Record<string, RouteQueryValue> = route.query as Record<
      string,
      RouteQueryValue
    >,
  ): FilterValues<TSchema>[K] => {
    const item = resolvedSchema.value[key];
    const queryValue = query[key as string];

    if (item.parse) {
      return applyFilterRules(cloneFilterValue(item.parse(queryValue)), item);
    }

    return applyFilterRules(
      cloneFilterValue(parsePrimitiveValue(queryValue, item.default)),
      item,
    );
  };

  const filters = Object.keys(resolvedSchema.value).reduce((acc, key) => {
    const typedKey = key as keyof TSchema;
    acc[typedKey] = ref(
      createValue(typedKey),
    ) as FilterRefs<TSchema>[keyof TSchema];
    return acc;
  }, {} as FilterRefs<TSchema>);

  const getFilterValues = () => {
    return Object.keys(filters).reduce((acc, key) => {
      const typedKey = key as keyof TSchema;
      acc[typedKey] = filters[typedKey].value;
      return acc;
    }, {} as FilterValues<TSchema>);
  };

  const buildFilterQuery = (
    values: FilterValues<TSchema>,
  ): Record<string, string | undefined> => {
    return Object.keys(resolvedSchema.value).reduce(
      (acc, key) => {
        const typedKey = key as keyof TSchema;
        const item = resolvedSchema.value[typedKey];
        const serialize = item.serialize ?? defaultSerialize;

        acc[key] = serialize(values[typedKey], item.default);
        return acc;
      },
      {} as Record<string, string | undefined>,
    );
  };

  const mergeFilterQuery = (nextQuery: Record<string, string | undefined>) => {
    const mergedQuery = Object.entries(route.query).reduce(
      (acc, [key, value]) => {
        if (!(key in resolvedSchema.value)) {
          acc[key] = Array.isArray(value)
            ? (value.filter((entry) => entry !== null) as string[])
            : value;
        }

        return acc;
      },
      {} as Record<string, RouteQueryValue>,
    );

    Object.entries(nextQuery).forEach(([key, value]) => {
      if (value !== undefined) {
        mergedQuery[key] = value;
      }
    });

    return mergedQuery;
  };

  const syncFromRoute = () => {
    Object.keys(resolvedSchema.value).forEach((key) => {
      if (mode === "manual" && !(key in route.query)) {
        return;
      }

      const typedKey = key as keyof TSchema;
      const nextValue = createValue(typedKey);

      if (!isSameValue(filters[typedKey].value, nextValue)) {
        filters[typedKey].value = nextValue;
      }
    });
  };

  const applyFilters = async () => {
    const nextQuery = mergeFilterQuery(buildFilterQuery(getFilterValues()));

    if (
      isSameQuery(nextQuery as Record<string, string | undefined>, route.query)
    ) {
      return;
    }

    await router.replace({
      query: nextQuery,
    });
  };

  watch(
    () => route.query,
    () => {
      syncFromRoute();
    },
  );

  if (mode === "auto") {
    watch(
      Object.values(filters),
      async () => {
        await applyFilters();
      },
      { deep: true },
    );
  }

  const filterModel = computed({
    get: () => {
      const values = getFilterValues();

      return Object.keys(values).reduce(
        (acc, key) => {
          const typedKey = key as keyof TSchema;
          const item = resolvedSchema.value[typedKey];
          const value = values[typedKey];

          acc[key] = item.toUI ? item.toUI(value) : value;
          return acc;
        },
        {} as Record<string, unknown>,
      );
    },
    set: (values: Record<string, unknown>) => {
      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof TSchema;

        if (!(typedKey in filters)) {
          return;
        }

        const item = resolvedSchema.value[typedKey];
        const nextValue = item.fromUI
          ? item.fromUI(values[key])
          : defaultFromUI(item, values[key]);

        filters[typedKey].value = applyFilterRules(
          cloneFilterValue(nextValue),
          item,
        ) as FilterValues<TSchema>[typeof typedKey];
      });
    },
  });

  const fields = computed(() => {
    return Object.entries(resolvedSchema.value)
      .filter(([, item]) => item.showInFilterPanel !== false)
      .map(([key, item]) => ({
        key,
        type: item.type,
        label: item.label,
        placeholder: item.placeholder,
        options: item.options,
        component: item.component,
        props: item.props,
      }));
  });

  const resetFilters = async () => {
    Object.keys(resolvedSchema.value).forEach((key) => {
      const typedKey = key as keyof TSchema;
      filters[typedKey].value = cloneFilterValue(
        resolvedSchema.value[typedKey].default,
      );
    });
  };

  const apiQuery = computed(() => {
    const values = getFilterValues();

    return cleanApiQuery(
      Object.keys(values).reduce(
        (acc, key) => {
          const typedKey = key as keyof TSchema;
          const item = resolvedSchema.value[typedKey];
          const value = values[typedKey];

          if (!item.query) {
            if (!isSameValue(value, item.default)) {
              acc[key] = value;
            }

            return acc;
          }

          if (typeof item.query === "function") {
            const transformedQuery = item.query(value, values);

            if (transformedQuery) {
              Object.assign(acc, transformedQuery);
            }

            return acc;
          }

          if (!isSameValue(value, item.default)) {
            acc[item.query] = value;
          }

          return acc;
        },
        {} as Record<string, unknown>,
      ),
    );
  });

  const shareUrl = computed(() => buildUrlFromQuery(route.path, route.query));

  return {
    filters,
    filterModel,
    fields,
    applyFilters,
    resetFilters,
    apiQuery,
    shareUrl,
  };
}
