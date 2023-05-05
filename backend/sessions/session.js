/*!
 * Connect - session - Session
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

"use strict";

/**
 * Expose Session.
 */

module.exports = Session;

/**
 * Create a new `Session` with the given request and `data`.
 *
 * @param {IncomingRequest} request
 * @param {Object} data
 * @api private
 */

class Session {
  constructor(request, data) {
    Object.defineProperty(this, "request", { value: request });
    Object.defineProperty(this, "id", { value: request.sessionID });

    if (typeof data === "object" && data !== null) {
      // merge data into this, ignoring prototype properties
      for (let prop in data) {
        if (!(prop in this)) {
          this[prop] = data[prop];
        }
      }
    }
  }
}

/**
 * Update reset `.cookie.maxAge` to prevent
 * the cookie from expiring when the
 * session is still active.
 *
 * @return {Session} for chaining
 * @api public
 */

defineMethod(Session.prototype, "touch", function touch() {
  return this.resetMaxAge();
});

/**
 * Reset `.maxAge` to `.originalMaxAge`.
 *
 * @return {Session} for chaining
 * @api public
 */

defineMethod(Session.prototype, "resetMaxAge", function resetMaxAge() {
  this.cookie.maxAge = this.cookie.originalMaxAge;
  return this;
});

/**
 * Save the session data with optional callback `fn(err)`.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod(Session.prototype, "save", function save(fn) {
  this.request.sessionStore.set(this.id, this, fn || function () {});
  return this;
});

/**
 * Re-loads the session data _without_ altering
 * the maxAge properties. Invokes the callback `fn(err)`,
 * after which time if no exception has occurred the
 * `req.session` property will be a new `Session` object,
 * although representing the same session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod(Session.prototype, "reload", function reload(fn) {
  let req = this.request;
  let store = this.request.sessionStore;

  store.get(this.id, function (err, sess) {
    if (err) return fn(err);
    if (!sess) return fn(new Error("failed to load session"));
    store.createSession(request, sess);
    fn();
  });
  return this;
});

/**
 * Destroy `this` session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod(Session.prototype, "destroy", function destroy(fn) {
  delete this.request.session;
  this.request.sessionStore.destroy(this.id, fn);
  return this;
});

/**
 * Regenerate this request's session.
 *
 * @param {Function} fn
 * @return {Session} for chaining
 * @api public
 */

defineMethod(Session.prototype, "regenerate", function regenerate(fn) {
  this.request.sessionStore.regenerate(this.req, fn);
  return this;
});

/**
 * Helper function for creating a method on a prototype.
 *
 * @param {Object} obj
 * @param {String} name
 * @param {Function} fn
 * @private
 */
function defineMethod(obj, name, fn) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: false,
    value: fn,
    writable: true,
  });
}
