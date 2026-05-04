export default () => {
  const fieldRootClass =
    "app-control-shape w-full border-0 bg-transparent text-text-primary shadow-none";
  const fieldInputClass = "app-control-input";
  const overlayClass =
    "mt-2 overflow-hidden rounded-2xl border border-border-primary bg-white shadow-[0_20px_55px_rgba(15,23,42,0.14)]";
  const optionClass =
    "px-4 py-2.5 text-sm text-text-primary transition hover:bg-link-primary";

  const dropdownStyle = computed(() => {
    return {
      root: {
        class: fieldRootClass,
      },
      label: { class: `${fieldInputClass} !pb-0 !pt-3` },
      dropdown: {
        class: "flex w-11 items-center justify-center text-text-icon",
      },
      clearIcon: {
        class: "right-11 text-text-icon",
      },
      filterInput: {
        class: "dropdown-filter-input",
      },
      filterIcon: {
        class: "right-3 dropdown-icon",
      },
      panel: {
        class: overlayClass,
      },
      listContainer: {
        class: "max-h-64 overflow-y-auto py-1",
      },
      header: {
        class: "border-b border-border-primary bg-bg-secondary p-2",
      },
      item: ({ context }: any) => ({
        class: context.selected
          ? `${optionClass} bg-selected-primary font-medium`
          : context.focused
            ? `${optionClass} bg-link-primary`
            : optionClass,
      }),
      emptyMessage: {
        class: "p-4 text-sm text-text-secondary",
      },
      optionGroupLabel: {
        class:
          "px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-icon",
      },
      overlay: {
        class: "!z-[9999]",
      },
    };
  });

  const multiSelectStyle = computed(() => {
    return {
      ...dropdownStyle.value,
      header: {
        class:
          "flex items-center justify-between gap-2 p-2 bg-inherit dropdown-text",
      },
      item: ({ context }: any) => ({
        class: context.selected
          ? "flex items-center gap-2 dropdown-item dropdown-item-selected"
          : context.focused
            ? "flex items-center gap-2 dropdown-item"
            : "flex items-center gap-2 dropdown-item",
      }),
      label: {
        class:
          "app-control-shape px-3 py-2 text-sm text-text-primary flex flex-wrap items-center gap-1.5",
      },
      dropdown: {
        class: "flex w-11 items-center justify-center text-text-icon",
      },
      clearIcon: {
        class: "xs",
      },
      headerCheckboxContainer: {
        class: "dropdown-checkbox-container",
      },
      headerCheckbox: {
        class: "dropdown-checkbox ring-0",
      },
      checkboxContainer: {
        class: "dropdown-checkbox-container",
      },
      checkbox: {
        class: "dropdown-checkbox",
      },
      checkboxIcon: {
        class: "dropdown-checkbox ",
      },
      token: {
        class: "dropdown-token",
      },
      tokenLabel: {
        class: "dropdown-token-label",
      },
      removeTokenIcon: {
        class: "dropdown-token-icon",
      },
      listContainer: {
        class: "max-h-64 overflow-y-auto py-1",
      },
    };
  });

  const datePickerStyle = computed(() => {
    return {
      input: { class: fieldRootClass },
      panel: { class: `${overlayClass} p-3` },
      header: {
        class: "bg-white py-3.5 text-text-primary",
      },
    };
  });

  const autocompleteStyle = computed(() => {
    return {
      root: {
        class: `${fieldRootClass} !h-auto`,
      },
      input: {
        class:
          "app-control-shape flex-1 bg-transparent border-none outline-none ring-0 !px-0 text-sm text-text-primary",
      },
      inputToken: {
        class:
          "flex-1 placeholder:font-light placeholder:text-placeholder-primary",
      },
      panel: {
        class: `${overlayClass} max-h-[220px] overflow-y-auto w-[250px] xl:w-[350px]`,
      },
      header: {
        class:
          "border-b border-border-primary bg-bg-secondary py-3.5 text-text-primary",
      },
      container: {
        class: "app-control-shape flex items-center gap-2 flex-wrap px-3 py-2",
      },
      token:
        "gap-2 inline-flex items-center rounded-full border border-border-primary bg-bg-secondary px-2.5 py-1 text-sm font-medium text-text-primary",
      tokenLabel: {
        class: "pr-1 text-text-primary",
      },
      removeTokenIcon: {
        class: "text-text-icon",
      },
      item: ({ context }: any) => ({
        class: context.selected
          ? `${optionClass} bg-selected-primary font-medium`
          : context.focused
            ? `${optionClass} bg-link-primary`
            : optionClass,
      }),
      emptyMessage: {
        class: "p-4 text-sm text-text-secondary",
      },
    };
  });

  const multipleInputStyle = computed(() => {
    return {
      ...autocompleteStyle.value,
    };
  });

  const inputNumberStyle = computed(() => {
    return {
      root: { class: fieldRootClass },
      input: {
        class: `${fieldInputClass} !pl-4 !pr-4`,
      },
    };
  });

  const editorStyle = computed(() => {
    return {
      input: { class: "input-style ring-0" },
      panel: { class: "bg-bg-primary dropdown-text p-3" },
      header: {
        class: "bg-bg-primary dropdown-text py-3.5",
      },
    };
  });

  const dialogStyle = computed(() => {
    return {
      root: {
        class:
          "overflow-hidden rounded-2xl border border-border-primary bg-white shadow-2xl shadow-slate-200/80",
      },
      header: {
        class:
          "p-5 flex justify-between items-center border-b border-border-primary",
      },
      headerTitle: {
        class: "font-semibold",
      },
      content: {
        class: "p-3 max-h-[80vh] overflow-y-auto",
      },
      footer: {
        class:
          "p-3 border-t border-border-primary flex justify-end items-center",
      },
    };
  });

  const tooltipStyle = computed(() => {
    return {
      root: {
        class: "rounded-lg border border-slate-800 bg-slate-950 shadow-lg",
      },
      text: "text-white !text-xs !p-1.5",
    };
  });

  const menuStyle = computed(() => {
    return {
      root: {
        class: overlayClass,
      },
      list: {
        class: "!p-0",
      },
      item: {
        class: "group",
      },
      itemContent: {
        class:
          "rounded-[10px] transition hover:bg-[#F6F3EE] focus-within:bg-[#F6F3EE]",
      },
      action: {
        class:
          "flex w-full items-center rounded-[10px] px-3 py-2 text-left text-sm font-medium text-text-primary",
      },
      label: {
        class: "text-inherit",
      },
    };
  });

  return {
    dropdownStyle,
    multiSelectStyle,
    datePickerStyle,
    autocompleteStyle,
    multipleInputStyle,
    inputNumberStyle,
    editorStyle,
    dialogStyle,
    tooltipStyle,
    menuStyle,
  };
};
