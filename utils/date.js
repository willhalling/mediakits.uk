/**
 * Date Util
 */

/* Parse date string in YYYY-MM-DD hh:mm:ss format
** separator can be any non-digit character
** e.g. 2017:03:09 14:49:21
*/
export function parseDate(s) {
  const b = s.split(/\D/)
  return new Date(b[0], b[1] - 1, b[2], b[3], b[4], b[5])
}

export function formattedDate(d = new Date()) {
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()]
    .map(n => (n < 10 ? `0${n}` : `${n}`))
    .join('/')
}

export function getAge(birthDate, date) {

  if (!date || !birthDate) {
    return
  }

  function weeksBetween(d1, d2) {
    return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
  }

  let photoDate = new Date(date)

  let yearPhoto = photoDate.getYear()
  let monthPhoto = photoDate.getMonth()
  let datePhoto = photoDate.getDate()

  const dob = new Date(birthDate)

  let yearDob = dob.getYear()
  let monthDob = dob.getMonth()
  let dateDob = dob.getDate()
  let monthAge = ''
  let dateAge = ''
  let weekAge = ''

  let yearAge = yearPhoto - yearDob

  if (monthPhoto >= monthDob) monthAge = monthPhoto - monthDob
  else {
    yearAge--
    monthAge = 12 + monthPhoto - monthDob
  }

  if (datePhoto >= dateDob) dateAge = datePhoto - dateDob
  else {
    monthAge--
    dateAge = 31 + datePhoto - dateDob

    if (monthAge < 0) {
      monthAge = 11
      yearAge--
    }
  }

  if (weeksBetween(dob, photoDate) < 4) {
    weekAge = weeksBetween(dob, photoDate)
  }
  
  return {
    years: yearAge,
    months: monthAge,
    weeks: weekAge,
    days: dateAge
  }
}

export function getAgeString(age) {
  let ageString = ''
  let yearString = ''
  let monthString = ''
  let dayString = ''

  if ( age.years > 1 ) yearString = ' years'
  else yearString = ' year'
  if ( age.months> 1 ) monthString = ' months'
  else monthString = ' month'
  if ( age.days > 1 ) dayString = ' days'
  else dayString = ' day'
  
  if ( (age.years > 0) && (age.months > 0) && (age.days > 0) )
    ageString = age.years + yearString + ", " + age.months + monthString + ", &\n" + age.days + dayString + " old";
  else if ( (age.years == 0) && (age.months == 0) && (age.days > 0) )
    ageString = "Only " + age.days + dayString + " old";
  else if ( (age.years > 0) && (age.months == 0) && (age.days == 0) )
    ageString = age.years + yearString + " old. Happy Birthday!";
  else if ( (age.years > 0) && (age.months > 0) && (age.days == 0) )
    ageString = age.years + yearString + "&\n" + age.months + monthString + " old";
  else if ( (age.years == 0) && (age.months > 0) && (age.days > 0) )
    ageString = age.months + monthString + " &\n" + age.days + dayString + " old";
  else if ( (age.years > 0) && (age.months == 0) && (age.days > 0) )
    ageString = age.years + yearString + " &\n" + age.days + dayString + " old";
  else if ( (age.years == 0) && (age.months > 0) && (age.days == 0) )
    ageString = age.months + monthString + " months old";
  else ageString = "Could not calculate age. Make sure the date is in the past";
  return ageString;
}

export function ageText (ageData) {
  function text(number, format) {
    return `${format}`
  }
  if (ageData.years > 0) {
    return text(ageData.years, `year${ageData.years > 1 ? 's' : ''}`)
  }
  if (ageData.months > 0) {
    return text(ageData.months, `month${ageData.months > 1 ? 's' : ''}`)
  }
  if (ageData.days > 1 && ageData.days < 31) {
    return text(ageData.weeks, `week${ageData.weeks > 1 ? 's' : ''}`)
  }
  if (ageData.days >= 0) {
    if (ageData.days == 0) {
      ageData.days = ageData.days + 1
    }
    return text(ageData.days, `day${ageData.days > 1 ? 's' : ''}`)
  }
}

// https://stackoverflow.com/a/1353711/1657678
export function isValidDate(d) {
  return d instanceof Date && !isNaN(d)
}

// https://stackoverflow.com/a/22859920
export function weeksBetween(d1, d2) {
  d1 = new Date(d1)
  d2 = new Date(d2)
  const weeksString = Math.round(
    (d2 - d1) / (7 * 24 * 60 * 60 * 1000)
  ).toString()
  return `${weeksString} weeks`
}
