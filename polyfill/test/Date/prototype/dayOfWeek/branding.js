// Copyright (C) 2020 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-get-temporal.date.prototype.dayofweek
---*/

const dayOfWeek = Object.getOwnPropertyDescriptor(Temporal.Date.prototype, "dayOfWeek").get;

assert.sameValue(typeof dayOfWeek, "function");

assert.throws(TypeError, () => dayOfWeek.call(undefined), "undefined");
assert.throws(TypeError, () => dayOfWeek.call(null), "null");
assert.throws(TypeError, () => dayOfWeek.call(true), "true");
assert.throws(TypeError, () => dayOfWeek.call(""), "empty string");
assert.throws(TypeError, () => dayOfWeek.call(Symbol()), "symbol");
assert.throws(TypeError, () => dayOfWeek.call(1), "1");
assert.throws(TypeError, () => dayOfWeek.call({}), "plain object");
assert.throws(TypeError, () => dayOfWeek.call(Temporal.Date), "Temporal.Date");
assert.throws(TypeError, () => dayOfWeek.call(Temporal.Date.prototype), "Temporal.Date.prototype");
