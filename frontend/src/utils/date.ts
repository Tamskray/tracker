import moment from "moment";

export function getCalendarRange(date: moment.Moment) {
  const startOfMonth = date.clone().startOf("month");
  const endOfMonth = date.clone().endOf("month");
  const startDate = startOfMonth.clone().startOf("week");
  const endDate = endOfMonth.clone().endOf("week");

  return { startDate, endDate };
}
