/*eslint no-console: 0 */

require('colors');
const broken = require('broken-link-checker');
const data = require( '../smartcookies.json' );

function retrieveUrls(data, type) {
  return Object.keys(data)
            .filter(key => key!=='404')
            .map(key => {
              return {
                key,
                type,
                url: data[key][type]
              };
            });
}

urls = retrieveUrls(data, 'url')
          .concat(retrieveUrls(data, 'imgCredits'))
          .sort();

var failed = false;
const urlChecker = new broken.UrlChecker({}, {
  link: (result, data) => {
    const broken = result.broken;
    if (broken) {
      failed = true;
    }

    const url = result.url.original;
    console.log(
      broken? 'KO'.red : 'OK'.green,
      ' ', 
      `${data.key} - ${data.type}`,
      '\n' + url.substr(0, 80) + (url.length>80?'...' : ''),
      '\n'
    );
  },
  end: () => process.exit(+failed)
});

urls.map(urlObj=> urlChecker.enqueue(urlObj.url, '', urlObj));
