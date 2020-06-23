export function MonthNameMaker(setTimeStamp, fullDate) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  if(setTimeStamp === "month") {
    let newDate = fullDate.split("-")[1]
    if(newDate < 10) newDate = fullDate.split("-")[1].split("0")[1]
    const monthName = months[newDate - 1]
    return monthName
  }
  if(setTimeStamp === "year") {
    return fullDate.split("-")[0]
  }
}

export function fixNum(value) {
  return Number(parseFloat(value).toFixed(2))
}