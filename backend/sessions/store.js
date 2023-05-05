/*!
 * Connect - session - Store
 * Copyright(c) 2010 Sencha Inc.
 * Copyright(c) 2011 TJ Holowaychuk
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 * @private
 */

const Cookie = require("./cookie");
const EventEmitter = require("events").EventEmitter;
const Session = require("./session");
const util = require("util");

/**
 * Module exports.
 * @public
 */

module.exports = Store;

/**
 * Abstract base class for session stores.
 * @public
 */

class Store {
  constructor() {
    EventEmitter.call(this);
  }
  /**
   * Re-generate the given requests's session.
   *
   * @param {IncomingRequest} request
   * @return {Function} fn
   * @api public
   */
  regenerate(request, fn) {
    let self = this;
    this.destroy(request.sessionID, function (err) {
      self.generate(request);
      fn(err);
    });
  }
  /**
   * Load a `Session` instance via the given `sid`
   * and invoke the callback `fn(err, sess)`.
   *
   * @param {String} sid
   * @param {Function} fn
   * @api public
   */
  load(sid, fn) {
    let self = this;
    this.get(sid, function (err, sess) {
      if (err) return fn(err);
      if (!sess) return fn();
      let request = { sessionID: sid, sessionStore: self };
      fn(null, self.createSession(request, sess));
    });
  }
  /**
   * Create session from JSON `sess` data.
   *
   * @param {IncomingRequest} request
   * @param {Object} sess
   * @return {Session}
   * @api private
   */
  createSession(request, sess) {
    let expires = sess.cookie.expires;
    let originalMaxAge = sess.cookie.originalMaxAge;

    sess.cookie = new Cookie(sess.cookie);

    if (typeof expires === "string") {
      // convert expires to a Date object
      sess.cookie.expires = new Date(expires);
    }

    // keep originalMaxAge intact
    sess.cookie.originalMaxAge = originalMaxAge;

    request.session = new Session(request, sess);
    return request.session;
  }
}

/**
 * Inherit from EventEmitter.
 */

util.inherits(Store, EventEmitter);
