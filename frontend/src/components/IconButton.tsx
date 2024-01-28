import { Button, ButtonProps } from "react-bootstrap";

export const IconButton = (props: { icon: JSX.ElementType } & ButtonProps) => {
  const { icon, ...etc } = props;
  return (
    <Button
      variant="outline-primary"
      style={{ display: "flex", justifyContent: "center", padding: 8 }}
      {...etc}
    >
      <props.icon />
    </Button>
  );
};
