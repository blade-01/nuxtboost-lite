import type { LocationQueryValue } from "vue-router";

type RouteQueryValue = LocationQueryValue | LocationQueryValue[] | undefined;

export type UrlFilterConfigItem<TValue> = {
  default: TValue;
  parse?: (value: RouteQueryValue) => TValue;
  serialize?: (value: TValue, defaultValue: TValue) => string | undefined;
  oneOf?: TValue[];
  min?: TValue extends number ? number : never;
  max?: TValue extends number ? number : never;
};

type UrlFilterConfigEntry<TValue> = TValue | UrlFilterConfigItem<TValue>;

type WidenPrimitive<TValue> = TValue extends string
  ? string
  : TValue extends number
    ? number
    : TValue extends boolean
      ? boolean
      : TValue;

type InferFilterValue<TEntry> =
  TEntry extends UrlFilterConfigItem<infer TValue>
    ? TValue
    : WidenPrimitive<TEntry>;

type FilterValues<TConfig extends Record<string, UrlFilterConfigEntry<any>>> = {
  [K in keyof TConfig]: InferFilterValue<TConfig[K]>;
};

type FilterRefs<TConfig extends Record<string, UrlFilterConfigEntry<any>>> = {
  [K in keyof TConfig]: Ref<FilterValues<TConfig>[K]>;
};

type ApiQueryTransform<
  TConfig extends Record<string, UrlFilterConfigEntry<any>>,
  K extends keyof TConfig,
> = (
  value: FilterValues<TConfig>[K],
  filters: FilterValues<TConfig>,
) => Record<string, unknown> | undefined;

type QueryMap<TConfig extends Record<string, UrlFilterConfigEntry<any>>> =
  Partial<{
    [K in keyof TConfig]: string | ApiQueryTransform<TConfig, K>;
  }>;

type UseUrlFiltersOptions<
  TConfig extends Record<string, UrlFilterConfigEntry<any>>,
> = {
  mode?: "auto" | "manual";
  queryMap?: QueryMap<TConfig>;
};

type NormalizedConfig<TValue> = UrlFilterConfigItem<TValue>;

export type UrlDateRange = {
  from?: string;
  to?: string;
};

function normalizeQueryValue(value: RouteQueryValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0] ?? undefined;
  }

  return value ?? undefined;
}

function isConfigItem<TValue>(
  value: UrlFilterConfigEntry<TValue>,
): value is UrlFilterConfigItem<TValue> {
  return !!value && typeof value === "object" && "default" in value;
}

function parsePrimitiveValue<TValue>(
  queryValue: RouteQueryValue,
  defaultValue: TValue,
): TValue {
  const normalizedValue = normalizeQueryValue(queryValue);

  if (normalizedValue === undefined) {
    return defaultValue;
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

  return defaultValue;
}

function applyFilterRules<TValue>(
  value: TValue,
  item: UrlFilterConfigItem<TValue>,
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

  return String(value);
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

function normalizeConfig<
  TConfig extends Record<string, UrlFilterConfigEntry<any>>,
>(config: TConfig) {
  return Object.keys(config).reduce(
    (acc, key) => {
      const typedKey = key as keyof TConfig;
      const value = config[typedKey];

      acc[typedKey] = isConfigItem(value)
        ? value
        : {
            default: value,
          };

      return acc;
    },
    {} as {
      [K in keyof TConfig]: NormalizedConfig<FilterValues<TConfig>[K]>;
    },
  );
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

      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export function createDateRangeFilter(options?: {
  defaultValue?: UrlDateRange;
  separator?: string;
}) {
  const defaultValue = options?.defaultValue ?? {
    from: "",
    to: "",
  };
  const separator = options?.separator ?? ",";

  const parse = (value: RouteQueryValue): UrlDateRange => {
    const normalizedValue = normalizeQueryValue(value);

    if (!normalizedValue) {
      return { ...defaultValue };
    }

    const [from = "", to = ""] = normalizedValue.split(separator);

    return {
      from,
      to,
    };
  };

  const serialize = (value: UrlDateRange, fallback: UrlDateRange) => {
    const from = value?.from ?? "";
    const to = value?.to ?? "";
    const fallbackFrom = fallback?.from ?? "";
    const fallbackTo = fallback?.to ?? "";

    if (from === fallbackFrom && to === fallbackTo) {
      return undefined;
    }

    if (!from && !to) {
      return undefined;
    }

    return `${from}${separator}${to}`;
  };

  const toApiQuery = (
    value: UrlDateRange,
    keys?: {
      from?: string;
      to?: string;
    },
  ) => {
    return cleanApiQuery({
      [keys?.from ?? "from"]: value?.from,
      [keys?.to ?? "to"]: value?.to,
    });
  };

  return {
    default: defaultValue,
    parse,
    serialize,
    toApiQuery,
  };
}

export default function useUrlFilters<
  TConfig extends Record<string, UrlFilterConfigEntry<any>>,
>(
  config: TConfig,
  options?: UseUrlFiltersOptions<TConfig>,
): {
  filters: FilterRefs<TConfig>;
  filterModel: WritableComputedRef<FilterValues<TConfig>>;
  applyFilters: () => Promise<void>;
  resetFilters: () => Promise<void>;
  apiQuery: ComputedRef<Record<string, unknown>>;
  shareUrl: ComputedRef<string>;
} {
  const route = useRoute();
  const router = useRouter();
  const mode = options?.mode ?? "auto";
  const normalizedConfig = normalizeConfig(config);

  const createValue = <K extends keyof TConfig>(
    key: K,
    query: Record<string, RouteQueryValue> = route.query as Record<
      string,
      RouteQueryValue
    >,
  ): FilterValues<TConfig>[K] => {
    const item = normalizedConfig[key];
    const queryValue = query[key as string];

    if (item.parse) {
      return applyFilterRules(cloneFilterValue(item.parse(queryValue)), item);
    }

    return applyFilterRules(
      cloneFilterValue(parsePrimitiveValue(queryValue, item.default)),
      item,
    );
  };

  const filters = Object.keys(normalizedConfig).reduce((acc, key) => {
    const typedKey = key as keyof TConfig;
    acc[typedKey] = ref(
      createValue(typedKey),
    ) as FilterRefs<TConfig>[keyof TConfig];
    return acc;
  }, {} as FilterRefs<TConfig>);

  const buildFilterQuery = (
    values: FilterValues<TConfig>,
  ): Record<string, string | undefined> => {
    return Object.keys(normalizedConfig).reduce(
      (acc, key) => {
        const typedKey = key as keyof TConfig;
        const item = normalizedConfig[typedKey];
        const serialize = item.serialize ?? defaultSerialize;

        acc[key] = serialize(values[typedKey], item.default);
        return acc;
      },
      {} as Record<string, string | undefined>,
    );
  };

  const getFilterValues = () => {
    return Object.keys(filters).reduce((acc, key) => {
      const typedKey = key as keyof TConfig;
      acc[typedKey] = filters[typedKey].value;
      return acc;
    }, {} as FilterValues<TConfig>);
  };

  const mergeFilterQuery = (nextQuery: Record<string, string | undefined>) => {
    const mergedQuery = Object.entries(route.query).reduce(
      (acc, [key, value]) => {
        if (!(key in normalizedConfig)) {
          acc[key] = Array.isArray(value)
            ? (value.filter((v) => v !== null) as string[])
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
    Object.keys(normalizedConfig).forEach((key) => {
      const typedKey = key as keyof TConfig;
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
    get: () => getFilterValues(),
    set: (values: Partial<FilterValues<TConfig>>) => {
      Object.keys(values).forEach((key) => {
        const typedKey = key as keyof TConfig;
        const nextValue = values[typedKey];

        if (!(typedKey in filters) || nextValue === undefined) {
          return;
        }

        filters[typedKey].value =
          nextValue as FilterValues<TConfig>[typeof typedKey];
      });
    },
  });

  const resetFilters = async () => {
    Object.keys(normalizedConfig).forEach((key) => {
      const typedKey = key as keyof TConfig;
      filters[typedKey].value = cloneFilterValue(
        normalizedConfig[typedKey].default,
      );
    });
  };

  const apiQuery = computed(() => {
    const values = getFilterValues();
    const mappedQuery = Object.keys(values).reduce(
      (acc, key) => {
        const typedKey = key as keyof TConfig;
        const mapper = options?.queryMap?.[typedKey];
        const value = values[typedKey];

        if (typeof mapper === "function") {
          const transformedQuery = mapper(value, values);

          if (transformedQuery) {
            Object.assign(acc, transformedQuery);
          }

          return acc;
        }

        acc[(mapper as string | undefined) ?? key] = value;
        return acc;
      },
      {} as Record<string, unknown>,
    );

    return cleanApiQuery(mappedQuery);
  });

  const shareUrl = computed(() => {
    return buildUrlFromQuery(route.path, route.query);
  });

  return {
    filters,
    filterModel,
    applyFilters,
    resetFilters,
    apiQuery,
    shareUrl,
  };
}
