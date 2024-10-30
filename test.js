const currentDate = new Date();

const vietnamTimeOffset = 7 * 60 * 60 * 1000; // GMT+7 in milliseconds
const Date = new Date(currentDate.getTime() + vietnamTimeOffset);

console.log(vietnamTime.toISOString().replace('Z', '+07:00'));
