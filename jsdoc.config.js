'use strict';

module.exports = {
  templates: {
    default: {
      useLongnameInNav: true,
      staticFiles: {
        include: ['./'],
        includePattern: /.*?\.include-in-jsdoc\..*?|CNAME/
      }
    }
  }
}