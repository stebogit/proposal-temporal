/* global __debug__ */

import { GetDefaultCalendar } from './calendar.mjs';
import { ES } from './ecmascript.mjs';
import { DateTimeFormat } from './intl.mjs';
import { GetIntrinsic, MakeIntrinsicClass } from './intrinsicclass.mjs';

import {
  ISO_YEAR,
  ISO_MONTH,
  ISO_DAY,
  HOUR,
  MINUTE,
  SECOND,
  MILLISECOND,
  MICROSECOND,
  NANOSECOND,
  CALENDAR,
  CreateSlots,
  GetSlot,
  SetSlot
} from './slots.mjs';

const ObjectAssign = Object.assign;

function TemporalDateToString(date) {
  const year = ES.ISOYearString(GetSlot(date, ISO_YEAR));
  const month = ES.ISODateTimePartString(GetSlot(date, ISO_MONTH));
  const day = ES.ISODateTimePartString(GetSlot(date, ISO_DAY));
  const calendar = ES.FormatCalendarAnnotation(GetSlot(date, CALENDAR));
  return `${year}-${month}-${day}${calendar}`;
}

export class Date {
  constructor(isoYear, isoMonth, isoDay, calendar = GetDefaultCalendar()) {
    isoYear = ES.ToInteger(isoYear);
    isoMonth = ES.ToInteger(isoMonth);
    isoDay = ES.ToInteger(isoDay);
    calendar = ES.ToTemporalCalendar(calendar);
    ES.RejectDate(isoYear, isoMonth, isoDay);
    ES.RejectDateRange(isoYear, isoMonth, isoDay);
    CreateSlots(this);
    SetSlot(this, ISO_YEAR, isoYear);
    SetSlot(this, ISO_MONTH, isoMonth);
    SetSlot(this, ISO_DAY, isoDay);
    SetSlot(this, CALENDAR, calendar);

    if (typeof __debug__ !== 'undefined' && __debug__) {
      Object.defineProperty(this, '_repr_', {
        value: `${this[Symbol.toStringTag]} <${this}>`,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }
  get calendar() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR);
  }
  get era() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).era(this);
  }
  get year() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).year(this);
  }
  get month() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).month(this);
  }
  get day() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).day(this);
  }
  get dayOfWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfWeek(this);
  }
  get dayOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).dayOfYear(this);
  }
  get weekOfYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).weekOfYear(this);
  }
  get daysInWeek() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInWeek(this);
  }
  get daysInMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInMonth(this);
  }
  get daysInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).daysInYear(this);
  }
  get monthsInYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).monthsInYear(this);
  }
  get isLeapYear() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return GetSlot(this, CALENDAR).isLeapYear(this);
  }
  with(temporalDateLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let source;
    const props = ES.ToPartialRecord(temporalDateLike, ['calendar', 'day', 'era', 'month', 'year']);
    if (!props) {
      throw new RangeError('invalid date-like');
    }
    let calendar = props.calendar;
    if (calendar) {
      source = new Date(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    } else {
      calendar = GetSlot(this, CALENDAR);
      source = this;
    }
    const fields = ES.ToTemporalDateRecord(source);
    ObjectAssign(fields, props);
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = calendar.dateFromFields(fields, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  withCalendar(calendar) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    calendar = ES.ToTemporalCalendar(calendar);
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = new Construct(GetSlot(this, ISO_YEAR), GetSlot(this, ISO_MONTH), GetSlot(this, ISO_DAY), calendar);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  plus(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));
    duration = { years, months, weeks, days };
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = GetSlot(this, CALENDAR).datePlus(this, duration, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  minus(temporalDurationLike, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    let duration = ES.ToLimitedTemporalDuration(temporalDurationLike);
    let { years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = duration;
    ES.RejectDurationSign(years, months, weeks, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds);
    ({ days } = ES.BalanceDuration(days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds, 'days'));
    duration = { years, months, weeks, days };
    const Construct = ES.SpeciesConstructor(this, Date);
    const result = GetSlot(this, CALENDAR).dateMinus(this, duration, options, Construct);
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  difference(other, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
    const calendar = GetSlot(this, CALENDAR);
    const otherCalendar = GetSlot(other, CALENDAR);
    if (ES.CalendarToString(calendar) !== ES.CalendarToString(otherCalendar)) {
      throw new RangeError(
        `cannot compute difference between dates of ${calendar.id} and ${otherCalendar.id} calendars`
      );
    }
    return calendar.dateDifference(other, this, options);
  }
  equals(other) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    if (!ES.IsTemporalDate(other)) throw new TypeError('invalid Date object');
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(this, slot);
      const val2 = GetSlot(other, slot);
      if (val1 !== val2) return false;
    }
    return ES.CalendarToString(GetSlot(this, CALENDAR)) === ES.CalendarToString(GetSlot(other, CALENDAR));
  }
  toString() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return TemporalDateToString(this);
  }
  toJSON() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return TemporalDateToString(this);
  }
  toLocaleString(locales = undefined, options = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return new DateTimeFormat(locales, options).format(this);
  }
  valueOf() {
    throw new TypeError('use compare() or equals() to compare Temporal.Date');
  }
  toDateTime(temporalTime = undefined) {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const year = GetSlot(this, ISO_YEAR);
    const month = GetSlot(this, ISO_MONTH);
    const day = GetSlot(this, ISO_DAY);
    const calendar = GetSlot(this, CALENDAR);
    const DateTime = GetIntrinsic('%Temporal.DateTime%');

    if (temporalTime === undefined) return new DateTime(year, month, day, 0, 0, 0, 0, 0, 0, calendar);

    if (!ES.IsTemporalTime(temporalTime)) throw new TypeError('invalid Temporal.Time object');
    const hour = GetSlot(temporalTime, HOUR);
    const minute = GetSlot(temporalTime, MINUTE);
    const second = GetSlot(temporalTime, SECOND);
    const millisecond = GetSlot(temporalTime, MILLISECOND);
    const microsecond = GetSlot(temporalTime, MICROSECOND);
    const nanosecond = GetSlot(temporalTime, NANOSECOND);
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond, calendar);
  }
  toYearMonth() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const YearMonth = GetIntrinsic('%Temporal.YearMonth%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalDateRecord(this);
    const yearMonth = calendar.yearMonthFromFields(fields, {}, YearMonth);
    if (!ES.IsTemporalYearMonth(yearMonth)) throw new TypeError('invalid result');
    return yearMonth;
  }
  toMonthDay() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    const MonthDay = GetIntrinsic('%Temporal.MonthDay%');
    const calendar = GetSlot(this, CALENDAR);
    const fields = ES.ToTemporalDateRecord(this);
    const monthDay = calendar.monthDayFromFields(fields, {}, MonthDay);
    if (!ES.IsTemporalMonthDay(monthDay)) throw new TypeError('invalid result');
    return monthDay;
  }
  getFields() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return ES.ToTemporalDateRecord(this);
  }
  getISOFields() {
    if (!ES.IsTemporalDate(this)) throw new TypeError('invalid receiver');
    return {
      calendar: GetSlot(this, CALENDAR),
      isoDay: GetSlot(this, ISO_DAY),
      isoMonth: GetSlot(this, ISO_MONTH),
      isoYear: GetSlot(this, ISO_YEAR)
    };
  }
  static from(item, options = undefined) {
    const overflow = ES.ToTemporalOverflow(options);
    let result;
    if (ES.Type(item) === 'Object') {
      if (ES.IsTemporalDate(item)) {
        const year = GetSlot(item, ISO_YEAR);
        const month = GetSlot(item, ISO_MONTH);
        const day = GetSlot(item, ISO_DAY);
        const calendar = GetSlot(item, CALENDAR);
        result = new this(year, month, day, calendar);
      } else {
        const { calendar = GetDefaultCalendar(), day, era, month, year } = ES.ToTemporalDateRecord(item);
        result = calendar.dateFromFields({ day, era, month, year }, { overflow }, this);
      }
    } else {
      let { year, month, day, calendar = GetDefaultCalendar() } = ES.ParseTemporalDateString(ES.ToString(item));
      ({ year, month, day } = ES.RegulateDate(year, month, day, overflow));
      result = new this(year, month, day, calendar);
    }
    if (!ES.IsTemporalDate(result)) throw new TypeError('invalid result');
    return result;
  }
  static compare(one, two) {
    if (!ES.IsTemporalDate(one) || !ES.IsTemporalDate(two)) throw new TypeError('invalid Date object');
    for (const slot of [ISO_YEAR, ISO_MONTH, ISO_DAY]) {
      const val1 = GetSlot(one, slot);
      const val2 = GetSlot(two, slot);
      if (val1 !== val2) return ES.ComparisonResult(val1 - val2);
    }
    const cal1 = ES.CalendarToString(GetSlot(one, CALENDAR));
    const cal2 = ES.CalendarToString(GetSlot(two, CALENDAR));
    return ES.ComparisonResult(cal1 < cal2 ? -1 : cal1 > cal2 ? 1 : 0);
  }
}

MakeIntrinsicClass(Date, 'Temporal.Date');
