import {NSConfigurator} from '@classroomtechtools/nsconfigurator';

const API = Symbol('discovery_api');
const RESOURCE = Symbol('resource');
const MAP = Symbol('map');

class APIBase {
  constructor (service) {
    this.service = service;
    this.name = 'admin';
    this.version = 'reports_v1';
    this[MAP] = new Map();
  }

  get [RESOURCE] () {
    throw new Error("Not implemented: [RESOURCE]");
  }

  [API] (method) {
    const cacheKey = `${this.name}${this.version}${method}`;
    if (this[MAP].has(cacheKey)) return this[MAP].get(cacheKey);
    const ret = Endpoints.createGoogEndpointWithOauth(this.name, this.version, this[RESOURCE], method, this.service);
    this[MAP].set(cacheKey, ret);
    return ret;
  }
}



class Activities extends APIBase {
  get [RESOURCE] () {
    return 'spaces';
  }

  /**
   * This endpoint has a significant amount of useful query parameters. Consult the @{link https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/list documentation}.
   */
  list (userKey, applicationName, queryParameters={}) {
    return this[API]('list').createRequest('get', {userKey, applicationName}, {query: queryParameters});
  }

  /**
   * Not tried this yet, but looks interesting. Body should be @{link https://developers.google.com/admin-sdk/reports/reference/rest/v1/activities/watch#body.SubscriptionChannel subscription channel}.
   */
  watch (userKey, applicationName, queryParameters={}, body={}) {
    return this[API]('get').createRequest('post', {userKey, applicationName}, {query: queryParameters,
      payload: body
    });
  }
}


class Reportsv1 {
  constructor (service) {
    this.service = service;
  }

  static batch () {
    return Endpoints.batch();
  }

  static getService (privateKey, email) {
    const scopes = ['https://www.googleapis.com/auth/admin.reports.audit.readonly'];
    return Endpoints.makeGoogOauthService('MyReportsService', email, privateKey, scopes);
  }

  static withService (service) {
    return new Reportsv1(service);
  }

  static asMe () {
    const oauth = Endpoints.getOauthAsMe();
    return new Reportsv1(oauth);
  }

  get Activities () {
    return NSConfigurator(new Activities(this.service));
  }

  // get Channels () {
  //   return NSConfigurator(new Members(this.service));
  // }

  // get CustomerUsageReports () {
  //   return NSConfigurator(new Messages(this.service));
  // }

  // get UserUsageReports () {
  //   return NSConfigurator(new Messages(this.service));
  // }
}

export {Reportsv1};
