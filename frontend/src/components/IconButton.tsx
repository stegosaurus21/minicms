import { Button, ButtonProps } from "react-bootstrap";

export const IconButton = (
  props: { icon: JSX.ElementType; label?: string } & ButtonProps
) => {
  const { icon, label, ...etc } = props;
  const button = (
    <Button
      variant="outline-primary"
      style={{ display: "flex", justifyContent: "center", padding: 8 }}
      {...etc}
    >
      <props.icon />
    </Button>
  );
  if (label === undefined) return button;
  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}
    >
      <span>{label}</span>
      {button}
    </div>
  );
};
