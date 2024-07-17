import dateFormat, { masks } from "dateformat"

const millisecondsInMinute = 60000;
const millisecondsInHour = 3.6e+6;
const millisecondsInDay = 8.64e+7;
const millisecondsInWeek = 8.64e+7*7;

const friendlyTimeFormat = (date) => {
    const dateAsDate = new Date(date);

    return `${dateFormat(dateAsDate, "h:MM")}${Math.floor(dateAsDate.getHours()/12) ? "pm" : "am"}`
}

const shortDateFormat = (date) => {
    const dateAsDate = new Date(date);

    return `${dateAsDate.getMonth() + 1}/${dateAsDate.getDate()}/${dateAsDate.getFullYear()}`;
}
export default {
    millisecondsInMinute: millisecondsInMinute,
    millisecondsInHour: millisecondsInHour,
    millisecondsInDay: millisecondsInDay,
    millisecondsInWeek: millisecondsInWeek,
    friendlyTimeFormat: friendlyTimeFormat,
    shortDateFormat: shortDateFormat
}