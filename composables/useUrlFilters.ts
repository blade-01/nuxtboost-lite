type QueryValue = string | number | boolean

type UrlFilterConfigItem<TValue> = {
  default: TValue
  parse?: (value: string | string[] | undefined) => TValue
  serialize?: (value: TValue, defaultValue: TValue) => string | undefined
}

type UrlFilterConfig<TFilters extends Record<string, QueryValue>> = {
  [K in keyof TFilters]: UrlFilterConfigItem<TFilters[K]>
}

type FilterRefs<TFilters extends Record<string, QueryValue>> = {
  [K in keyof TFilters]: Ref<TFilters[K]>
}

function normalizeQueryValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

function defaultSerialize<TValue extends QueryValue>(
  value: TValue,
  defaultValue: TValue
): string | undefined {
  if (value === defaultValue) {
    return undefined
  }

  return String(value)
}

function isSameQuery(
  left: Record<string, string | undefined>,
  right: Record<string, string | string[] | undefined>
): boolean {
  const leftKeys = Object.keys(left)
    .filter((key) => left[key] !== undefined)
    .sort()
  const rightKeys = Object.keys(right)
    .filter((key) => normalizeQueryValue(right[key]) !== undefined)
    .sort()

  if (leftKeys.length !== rightKeys.length) {
    return false
  }

  return leftKeys.every((key, index) => {
    const rightKey = rightKeys[index]
    return key === rightKey && left[key] === normalizeQueryValue(right[rightKey])
  })
}

export default function useUrlFilters<TFilters extends Record<string, QueryValue>>(
  config: UrlFilterConfig<TFilters>
): {
  filters: FilterRefs<TFilters>
  resetFilters: () => void
  shareUrl: ComputedRef<string>
} {
  const route = useRoute()
  const router = useRouter()

  const createValue = <K extends keyof TFilters>(key: K): TFilters[K] => {
    const item = config[key]
    const queryValue = route.query[key as string]

    if (item.parse) {
      return item.parse(queryValue)
    }

    const normalizedValue = normalizeQueryValue(queryValue)

    if (normalizedValue === undefined) {
      return item.default
    }

    if (typeof item.default === "number") {
      const parsed = Number(normalizedValue)
      return (Number.isNaN(parsed) ? item.default : parsed) as TFilters[K]
    }

    if (typeof item.default === "boolean") {
      return (normalizedValue === "true" || normalizedValue === "1") as TFilters[K]
    }

    return normalizedValue as TFilters[K]
  }

  const filters = Object.keys(config).reduce((acc, key) => {
    const typedKey = key as keyof TFilters
    acc[typedKey] = ref(createValue(typedKey)) as Ref<TFilters[keyof TFilters]>
    return acc
  }, {} as FilterRefs<TFilters>)

  const buildQuery = (): Record<string, string | undefined> => {
    return Object.keys(config).reduce(
      (acc, key) => {
        const typedKey = key as keyof TFilters
        const item = config[typedKey]
        const serialize = item.serialize ?? defaultSerialize

        acc[key] = serialize(filters[typedKey].value, item.default)
        return acc
      },
      {} as Record<string, string | undefined>
    )
  }

  const syncFromRoute = () => {
    Object.keys(config).forEach((key) => {
      const typedKey = key as keyof TFilters
      const nextValue = createValue(typedKey)

      if (filters[typedKey].value !== nextValue) {
        filters[typedKey].value = nextValue
      }
    })
  }

  watch(
    () => route.query,
    () => {
      syncFromRoute()
    }
  )

  watch(
    Object.values(filters),
    () => {
      const nextQuery = buildQuery()

      if (isSameQuery(nextQuery, route.query)) {
        return
      }

      router.replace({
        query: {
          ...route.query,
          ...nextQuery
        }
      })
    },
    { deep: true }
  )

  const shareUrl = computed(() => {
    const query = buildQuery()
    const searchParams = new URLSearchParams()

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.set(key, value)
      }
    })

    const queryString = searchParams.toString()
    const path = route.path

    if (!queryString) {
      return path
    }

    return `${path}?${queryString}`
  })

  const resetFilters = () => {
    Object.keys(config).forEach((key) => {
      const typedKey = key as keyof TFilters
      filters[typedKey].value = config[typedKey].default
    })
  }

  return {
    filters,
    resetFilters,
    shareUrl
  }
}
