import React from "react";

type Variant = "info" | "success" | "error";

type Props = {
  variant?: Variant;
  children: React.ReactNode;
  onClose?: () => void;
};

export default function InlineAlert({
  variant = "info",
  children,
  onClose,
}: Props) {
  return (
    <div className={`ui-alert ui-alert--${variant}`} role="status">
      <div className="ui-alert__content">{children}</div>
      {onClose && (
        <button
          type="button"
          className="ui-alert__close"
          aria-label="Dismiss"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
}
