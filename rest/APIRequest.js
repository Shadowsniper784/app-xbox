'use strict';

const https = require('https');
const FormData = require('@discordjs/form-data');
const fetch = require('node-fetch');

const AbortController = require('abort-controller')

let agent = null;

class APIRequest {
  constructor(rest, method, path, options, base) {
    this.rest = rest;
    this.client = rest.client;
    this.method = method;
    this.route = options.route;
    this.base = base
    this.options = options;
    this.retries = 0;

    const { userAgentSuffix } = this.client.options;
   // this.fullUserAgent = `${UserAgent}${userAgentSuffix.length ? `, ${userAgentSuffix.join(', ')}` : ''}`;

    let queryString = '';
    if (options.query) {
      const query = Object.entries(options.query)
        .filter(([, value]) => value !== null && typeof value !== 'undefined')
        .flatMap(([key, value]) => (Array.isArray(value) ? value.map(v => [key, v]) : [[key, value]]));
      queryString = new URLSearchParams(query).toString();
    }
    this.path = `${path}${queryString && `?${queryString}`}`;
  }

  make() {
    agent = agent == null ? new https.Agent({ ...this.client.options.http.agent, keepAlive: true }) : agent;

   
    const url = this.path;
    const base = this.base

    let headers = {
      ...this.client.options.http.headers,
      Accept: '*/*',
      Authorization: this.client.token,
			'Client-Version': '1.17.40',
      'User-Agent': 'MCPE/UWP',
      'Accept-Language': 'en-GB,en',
      'Accept-Encoding': 'gzip, deflate, be'
    };

    if (this.options.auth !== false) headers.Authorization = this.rest.getAuth();
    if (this.options.reason) headers['X-Audit-Log-Reason'] = encodeURIComponent(this.options.reason);
    if (this.options.headers) headers = Object.assign(headers, this.options.headers);

    let body;
    if (this.options.files && this.options.files.length) {
      body = new FormData();
      for (const file of this.options.files) {
        if (file && file.file) body.append(file.key == null ? file.name : file.key, file.file, file.name);
      }
      if (typeof this.options.data !== 'undefined') {
        if (this.options.dontUsePayloadJSON) {
          for (const [key, value] of Object.entries(this.options.data)) body.append(key, value);
        } else {
          body.append('payload_json', JSON.stringify(this.options.data));
        }
      }
      headers = Object.assign(headers, body.getHeaders());
      // eslint-disable-next-line eqeqeq
    } else if (this.options.data != null) {
      body = JSON.stringify(this.options.data);
      headers['Content-Type'] = 'application/json';
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.client.options.restRequestTimeout).unref();

    return fetch('https://'+base + '.xboxlive.com' + url, {
      method: this.method,
      headers,
      agent,
      body,
      signal: controller.signal,
      path: url
    }).finally(() => clearTimeout(timeout));
  }
}

module.exports = APIRequest;
