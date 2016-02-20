'use strict';

const config = {};

config.dist = {}
config.dist.base =  './';
config.dist.styles =  config.dist.base + '/css';
config.dist.scripts =  config.dist.base + '/js';
config.dist.views =  config.dist.base;

config.src = {}
config.src.base =  './src';
config.src.styles =  config.src.base + '/css';
config.src.scripts =  config.src.base + '/scripts';
config.src.views =  config.src.base + '/views';
config.src.partials = config.src.views  + '/partials';


module.exports = config;
