import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

interface InlineCellProps {
  value?: string;
  onCommit?: (value: string) => void;
  type?: "text" | "number";
  align?: "left" | "right";
  className?: string;
}

export default function InlineCell({
  value = "",
  onCommit,
  type = "text",
  align = "left",
  className,
}: InlineCellProps) {
  const [editing, setEditing] = useState(false);
  const [internal, setInternal] = useState(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setInternal(String(value ?? "")), [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = (keepFocus = false) => {
    setEditing(false);
    if (onCommit) onCommit(internal);
    if (!keepFocus && inputRef.current) inputRef.current.blur();
  };

  const cancel = () => {
    setInternal(String(value ?? ""));
    setEditing(false);
  };

  if (!editing) {
    return (
      <div
        className={className}
        onClick={() => setEditing(true)}
        style={{ cursor: "text", textAlign: align }}
      >
        {String(value ?? "")}
      </div>
    );
  }

  return (
    <TextField
      inputRef={inputRef}
      value={internal}
      onChange={(e) => setInternal(e.target.value)}
      variant="standard"
      onBlur={() => commit()}
      onKeyDown={(e) => {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") cancel();
      }}
      InputProps={{
        style: { textAlign: align, padding: 4, fontFamily: "inherit" },
      }}
      // use text input but set inputMode for numeric editing to avoid browser spinner arrows
      inputProps={{ inputMode: type === "number" ? "numeric" : "text" }}
      fullWidth
    />
  );
}
