import moment from "moment";

function toReadableDateTime(date: Date){
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
}

function toReadableDate(date: Date){
    return moment(date).format('MMMM Do YYYY');
}

export { toReadableDateTime, toReadableDate };
