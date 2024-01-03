import format from "date-fns/format";
import parse from "date-fns/parse";
import { Col, Container, Form, Row } from "react-bootstrap";
import {
  Control,
  Controller,
  FieldValues,
  Path,
  UseFormGetValues,
} from "react-hook-form";

export const DateTimeControl = <T extends FieldValues>(props: {
  control: Control<T>;
  field: Path<T>;
  getValues: UseFormGetValues<T>;
}) => {
  const { control, getValues, field } = props;
  return (
    <Container style={{ paddingLeft: 0, paddingRight: 0 }}>
      <Row>
        <Col>
          <Controller
            control={control}
            name={field}
            render={({ field: { value, onChange, ...other } }) => (
              <Form.Control
                type="date"
                value={value ? format(value, "yyyyyy-MM-dd") : ""}
                onChange={(event) =>
                  onChange(
                    parse(
                      event.target.value,
                      "yyyyyy-MM-dd",
                      new Date(getValues(field) || 0)
                    ).getTime()
                  )
                }
                {...other}
              />
            )}
          />
        </Col>
        <Col>
          <Controller
            control={control}
            name={field}
            render={({ field: { value, onChange, ...other } }) => (
              <Form.Control
                type="time"
                value={value ? format(value, "HH:mm") : ""}
                onChange={(event) =>
                  onChange(
                    parse(
                      event.target.value,
                      "HH:mm",
                      new Date(getValues(field) || 0)
                    ).getTime()
                  )
                }
                {...other}
              />
            )}
          />
        </Col>
      </Row>
    </Container>
  );
};
