import { useModal, useToast } from "tailvue";

type ToastTone = "success" | "info" | "warning" | "danger" | "denied";

type ToastAction = {
  label: string;
  action?: () => void;
};

type ToastPayload =
  | string
  | {
      title?: string;
      message: string;
      type?: ToastTone;
      timeout?: number;
      primary?: ToastAction;
      secondary?: ToastAction;
      wide?: boolean;
    };

type ModalTheme = "primary" | "danger" | "default" | "red" | "white";
type ToastInput = ToastPayload | unknown;

let toastInstance: ReturnType<typeof useToast> | null = null;
let modalInstance: ReturnType<typeof useModal> | null = null;

const resolveToast = () => {
  if (!import.meta.client) {
    return null;
  }

  if (!toastInstance) {
    toastInstance = useToast();
  }

  return toastInstance;
};

const resolveModal = () => {
  if (!import.meta.client) {
    return null;
  }

  if (!modalInstance) {
    modalInstance = useModal();
  }

  return modalInstance;
};

const normalizeToastTheme = (type?: ToastTone) => {
  switch (type) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "danger":
      return "danger";
    case "denied":
      return "denied";
    default:
      return "info";
  }
};

const normalizeModalTheme = (theme?: ModalTheme) => {
  if (theme === "red" || theme === "danger") {
    return "red";
  }

  if (theme === "white" || theme === "default") {
    return "white";
  }

  return "indigo";
};

const withModalDelay = (action?: () => void | Promise<void>) => {
  if (!action) {
    return undefined;
  }

  return () =>
    new Promise<void>((resolve, reject) => {
      window.setTimeout(async () => {
        try {
          await action();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 220);
    });
};

export default function () {
  const { getErrorMessage } = useErrorMessage();

  const isToastPayloadObject = (
    payload: unknown,
  ): payload is Exclude<ToastPayload, string> => {
    if (!payload || typeof payload !== "object" || !("message" in payload)) {
      return false;
    }

    const keys = Object.keys(payload);
    const toastOnlyKeys = [
      "title",
      "type",
      "timeout",
      "primary",
      "secondary",
      "wide",
    ];

    return (
      keys.length === 1 ||
      toastOnlyKeys.some((key) => Object.hasOwn(payload, key))
    );
  };

  const normalizeToastPayload = (
    payload: ToastInput,
    fallback: ToastTone,
  ): ToastPayload => {
    if (typeof payload === "string" || isToastPayloadObject(payload)) {
      return payload;
    }

    return {
      message: getErrorMessage(payload),
      type: fallback,
    };
  };

  const showToast = (payload: ToastInput, fallback: ToastTone = "info") => {
    const toast = resolveToast();

    if (!toast) {
      return;
    }

    const normalizedPayload = normalizeToastPayload(payload, fallback);

    if (typeof normalizedPayload === "string") {
      toast[normalizeToastTheme(fallback)](normalizedPayload);
      return;
    }

    toast.show({
      title: normalizedPayload.title,
      message: normalizedPayload.message,
      type: normalizedPayload.type || fallback,
      timeout: normalizedPayload.timeout,
      primary: normalizedPayload.primary,
      secondary: normalizedPayload.secondary,
      wide: normalizedPayload.wide,
    });
  };

  return {
    toast: {
      show: (payload: ToastInput) => showToast(payload, "info"),
      success: (payload: ToastInput) => showToast(payload, "success"),
      info: (payload: ToastInput) => showToast(payload, "info"),
      warning: (payload: ToastInput) => showToast(payload, "warning"),
      danger: (payload: ToastInput) => showToast(payload, "danger"),
      denied: (payload: ToastInput) => showToast(payload, "denied"),
    },
    modal: {
      show: (payload: {
        type?: "primary" | "danger";
        title?: string;
        body?: string;
        primary?: {
          label: string;
          theme?: ModalTheme;
          action?: () => void | Promise<void>;
        };
        secondary?: {
          label: string;
          theme?: ModalTheme;
          action?: () => void | Promise<void>;
        };
      }) => {
        const modal = resolveModal();

        if (!modal) {
          return;
        }

        modal.show({
          type: payload.type === "danger" ? "danger" : "info",
          title: payload.title,
          body: payload.body,
          primary: payload.primary
            ? {
                label: payload.primary.label,
                theme: normalizeModalTheme(payload.primary.theme),
                action: withModalDelay(payload.primary.action),
              }
            : undefined,
          secondary: payload.secondary
            ? {
                label: payload.secondary.label,
                theme: normalizeModalTheme(payload.secondary.theme),
                action: withModalDelay(payload.secondary.action),
              }
            : undefined,
        });
      },
    },
  };
}
