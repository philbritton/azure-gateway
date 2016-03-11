'use strict';

const express = require('express');
const http = require('http');
const httpProxy = require('http-proxy');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined')); // comprehensive HTTP logging

/* eslint-disable no-process-env */
const proxyTarget = httpProxy.createProxyServer({ target: process.env.PROXY_TARGET, changeOrigin: true });
/* eslint-enable no-process-env */
app.use((req, res) => { proxyTarget.web(req, res); });

/* eslint-disable no-process-env */
const portHttp = process.env.PORT;
/* eslint-enable no-process-env */
const httpServer = http.createServer(app);

httpServer.addListener('listening', () => {
  console.log('Service listening on localhost, port %d.', portHttp);
});

httpServer.addListener('error', (error) => {
  console.log(`Service stopped working: ${error.message}`);
});

httpServer.listen(portHttp);
