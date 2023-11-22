import { prettyDate, prettyInterval } from "src/utils/helper";

const TimeDisplay = (props: {
  displayDate: number | null;
  refDate: number;
  nullStr: string;
  pastStr: string;
}) => {
  const { displayDate, refDate, nullStr, pastStr } = props;

  if (displayDate === null) {
    return <span>{nullStr}</span>;
  }

  if (displayDate <= refDate) {
    return <span>{pastStr}</span>;
  }

  return (
    <>
      <span>{prettyInterval(refDate, displayDate)}</span>
      <br />
      <span>{prettyDate(refDate)}</span>
    </>
  );
};

export default TimeDisplay;
