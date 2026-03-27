import { useModal, useToast } from "tailvue"

type ToastTone = "success" | "info" | "warning" | "danger" | "denied"

type ToastPayload =
  | string
  | {
      title?: string
      message: string
      type?: ToastTone
      timeout?: number
      primary?: {
        label: string
        action?: () => void
      }
      secondary?: {
        label: string
        action?: () => void
      }
      wide?: boolean
    }

type ModalTheme = "primary" | "danger" | "default" | "red" | "white"

let toastInstance: ReturnType<typeof useToast> | null = null
let modalInstance: ReturnType<typeof useModal> | null = null

const resolveToast = () => {
  if (!import.meta.client) {
    return null
  }

  if (!toastInstance) {
    toastInstance = useToast()
  }

  return toastInstance
}

const resolveModal = () => {
  if (!import.meta.client) {
    return null
  }

  if (!modalInstance) {
    modalInstance = useModal()
  }

  return modalInstance
}

const normalizeToastTheme = (type?: ToastTone) => {
  switch (type) {
    case "success":
      return "success"
    case "warning":
      return "warning"
    case "danger":
      return "danger"
    case "denied":
      return "denied"
    default:
      return "info"
  }
}

const normalizeModalTheme = (theme?: ModalTheme) => {
  if (theme === "red" || theme === "danger") {
    return "red"
  }

  if (theme === "white" || theme === "default") {
    return "white"
  }

  return "indigo"
}

const withModalDelay = (action?: () => void | Promise<void>) => {
  if (!action) {
    return undefined
  }

  return () =>
    new Promise<void>((resolve, reject) => {
      window.setTimeout(async () => {
        try {
          await action()
          resolve()
        } catch (error) {
          reject(error)
        }
      }, 220)
    })
}

export default function () {
  const showToast = (payload: ToastPayload, fallback: ToastTone = "info") => {
    const toast = resolveToast()

    if (!toast) {
      return
    }

    if (typeof payload === "string") {
      toast[normalizeToastTheme(fallback)](payload)
      return
    }

    toast.show({
      title: payload.title,
      message: payload.message,
      type: payload.type || fallback,
      timeout: payload.timeout,
      primary: payload.primary,
      secondary: payload.secondary,
      wide: payload.wide
    })
  }

  return {
    toast: {
      show: (payload: ToastPayload) => showToast(payload, "info"),
      success: (payload: ToastPayload) => showToast(payload, "success"),
      info: (payload: ToastPayload) => showToast(payload, "info"),
      warning: (payload: ToastPayload) => showToast(payload, "warning"),
      danger: (payload: ToastPayload) => showToast(payload, "danger"),
      denied: (payload: ToastPayload) => showToast(payload, "denied")
    },
    modal: {
      show: (payload: {
        type?: "primary" | "danger"
        title?: string
        body?: string
        primary?: {
          label: string
          theme?: ModalTheme
          action?: () => void | Promise<void>
        }
        secondary?: {
          label: string
          theme?: ModalTheme
          action?: () => void | Promise<void>
        }
      }) => {
        const modal = resolveModal()

        if (!modal) {
          return
        }

        modal.show({
          type: payload.type === "danger" ? "danger" : "info",
          title: payload.title,
          body: payload.body,
          primary: payload.primary
            ? {
                label: payload.primary.label,
                theme: normalizeModalTheme(payload.primary.theme),
                action: withModalDelay(payload.primary.action)
              }
            : undefined,
          secondary: payload.secondary
            ? {
                label: payload.secondary.label,
                theme: normalizeModalTheme(payload.secondary.theme),
                action: withModalDelay(payload.secondary.action)
              }
            : undefined
        })
      }
    }
  }
}
