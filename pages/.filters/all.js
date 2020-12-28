module.exports = ({ _, Nunjucks, Markdown, OpenAPISampler }) => {

  Nunjucks.addFilter('split', (string, separator) => {
    if (typeof string !== 'string') return string;
    const regex = new RegExp(separator, 'g');
    return string.split(regex);
  });

  Nunjucks.addFilter('firstKey', (obj) => {
    if (!obj) return '';
    return Object.keys(obj)[0];
  });

  Nunjucks.addFilter('isExpandable', (obj) => {
    if (
      obj.type() === 'object' ||
      obj.type() === 'array' ||
      (obj.oneOf() && obj.oneOf().length) ||
      (obj.anyOf() && obj.anyOf().length) ||
      (obj.allOf() && obj.allOf().length) ||
      obj.items() ||
      obj.additionalItems() ||
      (obj.properties() && Object.keys(obj.properties()).length) ||
      obj.additionalProperties() ||
      (obj.extensions() && Object.keys(obj.extensions()).filter(e => !e.startsWith('x-parser-')).length) ||
      obj.patternProperties()
    ) return true;

    return false;
  });

  Nunjucks.addFilter('isArray', (arr) => {
    return Array.isArray(arr);
  });

  Nunjucks.addFilter('isObject', (obj) => {
    return typeof obj === 'object' && obj !== null;
  });

  Nunjucks.addFilter('contains', (array, element) => {
    if (!array || !Array.isArray(array)) return false;
    return array.includes(element);
  });

  Nunjucks.addFilter('log', (anything) => {
    console.log(anything);
  });

  Nunjucks.addFilter('markdown2html', (md) => {
    return Markdown().render(md || '');
  });

  Nunjucks.addFilter('getPayloadExamples', (msg) => {
    if (Array.isArray(msg.examples()) && msg.examples().find(e => e.payload)) {
      // Instead of flat or flatmap use this.
      return _.flatMap(msg.examples().map(e => e.payload).filter(Boolean));
    }

    if (msg.payload() && msg.payload().examples()) {
      return msg.payload().examples();
    }
  });

  Nunjucks.addFilter('getHeadersExamples', (msg) => {
    if (Array.isArray(msg.examples()) && msg.examples().find(e => e.headers)) {
      // Instead of flat or flatmap use this.
      return _.flatMap(msg.examples().map(e => e.headers).filter(Boolean));
    }

    if (msg.headers() && msg.headers().examples()) {
      return msg.headers().examples();
    }
  });

  Nunjucks.addFilter('generateExample', (schema) => {
    return JSON.stringify(OpenAPISampler.sample(schema) || '', null, 2);
  });

  Nunjucks.addFilter('generateMessageExample', (schema) => {
    var message = {};
    
    message["headers"] = OpenAPISampler.sample(schema.headers);
    if (schema.payload) {
      message["payload"] = OpenAPISampler.sample(schema.payload);
    }

    return JSON.stringify(message || '', null, 2);
  });

  Nunjucks.addFilter('nonParserExtensions', (schema) => {
    if (!schema || !schema.extensions || typeof schema.extensions !== 'function') return new Map();
    const extensions = Object.entries(schema.extensions());
    return new Map(extensions.filter(e => !e[0].startsWith('x-parser-')).filter(Boolean));
  });

  Nunjucks.addFilter('tree', path => {
    const filteredPaths = path.split('.').filter(Boolean);
    if (!filteredPaths.length) return;
    const dottedPath = filteredPaths.join('.');

    return `${dottedPath}.`;
  });

  Nunjucks.addFilter('buildPath', (propName, path) => {
    if (!path) return propName;
    return `${path}.${propName}`;
  });

  Nunjucks.addFilter('isRequired', (obj, key) => {
    return obj && Array.isArray(obj.required) && !!(obj.required.includes(key));
  });  


  Nunjucks.addFilter('acceptedValues', items => {
    if (!items) return '<em>Any</em>';

    return items.map(i => `<code>${i}</code>`).join(', ');
  });

  Nunjucks.addFilter('setAttribute', (dictionary, key, value) => {
    dictionary[key] = value;
    return dictionary;
  });

  Nunjucks.addFilter('increment', (value) => {
    num = Number(value);
    return String(++num);
  });

};
