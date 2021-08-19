'use strict';

const got = require('got');
require('dotenv').config();
const { readFile } = require('fs/promises');
const path = require('path');

const qlDir = process.env.QL_DIR || '/ql';
const authFile = path.join(qlDir, 'config/auth.json');

// console.log('req',process.env.QL_URL || 'http://ql.52mobileweb.com')
const api = got.extend({
  prefixUrl: process.env.QL_URL || 'http://42.193.100.8:5700',
  retry: { limit: 0 },
});

async function getToken() {
  const authConfig = JSON.parse(await readFile(authFile));
  return authConfig.token;
}

module.exports.getEnvs = async () => {
  const token = await getToken();
  // const token = `eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoickdBWXEtdUZVZzBkcVZMOGMyeTdTUm5KbW1vdWZvRHlhdnpMdnBCT1RSdWNlNkMjekpkZGQtUU9HSmtZcDl3aG1tZkh5RzVtbjYxV182a0ZPZ3pINnRFYjV3YiIsImlhdCI6MTYyOTI4MDYxOCwiZXhwIjoxNjI5NTM5ODE4fQ.x3jhc4YMwQrvGcEKd8aEoxuckoSo4kvjMdGRXwGsocoifkIs74H-wfUSRXGljJF2`
  const body = await api({
    url: 'api/envs',
    searchParams: {
      // searchValue: 'JD_COOKIE',
      searchValue: '',
      t: Date.now(),
    },
    headers: {
      // Accept: 'application/json',
      Accept: '*/*',
      authorization: `Bearer ${token}`,
    },
  }).json();
  // console.log('body',body)
  return body.data;
};

module.exports.getEnvsCount = async () => {
  const data = await this.getEnvs();
  return data?.length;
};

module.exports.addEnv = async (cookie, remarks) => {
  const token = await getToken();
  // const token = `eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoickdBWXEtdUZVZzBkcVZMOGMyeTdTUm5KbW1vdWZvRHlhdnpMdnBCT1RSdWNlNkMjekpkZGQtUU9HSmtZcDl3aG1tZkh5RzVtbjYxV182a0ZPZ3pINnRFYjV3YiIsImlhdCI6MTYyOTI4MDYxOCwiZXhwIjoxNjI5NTM5ODE4fQ.x3jhc4YMwQrvGcEKd8aEoxuckoSo4kvjMdGRXwGsocoifkIs74H-wfUSRXGljJF2`

  const body = await api({
    method: 'post',
    url: 'api/envs',
    params: { t: Date.now() },
    json: [{
      name: 'JD_COOKIE',
      value: cookie,
      remarks,
    }],
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.updateEnv = async (cookie, eid, remarks) => {
  const token = await getToken();
  // const token = `eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoickdBWXEtdUZVZzBkcVZMOGMyeTdTUm5KbW1vdWZvRHlhdnpMdnBCT1RSdWNlNkMjekpkZGQtUU9HSmtZcDl3aG1tZkh5RzVtbjYxV182a0ZPZ3pINnRFYjV3YiIsImlhdCI6MTYyOTI4MDYxOCwiZXhwIjoxNjI5NTM5ODE4fQ.x3jhc4YMwQrvGcEKd8aEoxuckoSo4kvjMdGRXwGsocoifkIs74H-wfUSRXGljJF2`

  const body = await api({
    method: 'put',
    url: 'api/envs',
    params: { t: Date.now() },
    json: {
      name: 'JD_COOKIE',
      value: cookie,
      _id: eid,
      remarks,
    },
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

module.exports.delEnv = async (eid) => {
  const token = await getToken();
  // const token = `eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoickdBWXEtdUZVZzBkcVZMOGMyeTdTUm5KbW1vdWZvRHlhdnpMdnBCT1RSdWNlNkMjekpkZGQtUU9HSmtZcDl3aG1tZkh5RzVtbjYxV182a0ZPZ3pINnRFYjV3YiIsImlhdCI6MTYyOTI4MDYxOCwiZXhwIjoxNjI5NTM5ODE4fQ.x3jhc4YMwQrvGcEKd8aEoxuckoSo4kvjMdGRXwGsocoifkIs74H-wfUSRXGljJF2`
  const body = await api({
    method: 'delete',
    url: 'api/envs',
    params: { t: Date.now() },
    body: JSON.stringify([eid]),
    // body: [eid],
    headers: {
      Accept: 'application/json',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8',
    },
  }).json();
  return body;
};

