var _ = require('lodash')
var camelcaseLib = require('camelcase')
var snakeCaseLib = require('snake-case')

/**
 *
 * TODO : Smart Error Throwing (e.g. Error throwing when Date type processing)
 *
 * TODO : 키 중복되었을때 해결 https://github.com/claudetech/js-change-object-case/blob/master/index.js#L69
 *
 * TODO : 각 object 별 커스터마이징 resolve 메소드 받을것 (예: moment)
 *
 */

var mongooseObjectSanitizer = (node) => {
  var needToMakeObjectFirst = ['model', 'EmbeddedDocument']
  var needToOmitFields = ['_id', '__v']

  if (!_.isEmpty(node) && typeof node === 'object' && node.constructor && needToMakeObjectFirst.includes(node.constructor.name)) {
    return _.omit(node.toObject(), needToOmitFields)
  } else {
    return node
  }
}

var options = {
  ignoreClass: [], // e.g. ['Date']

  // for Mongoose Object
  objectSanitizer: mongooseObjectSanitizer
}

var option = (inputOptions) => {
  options = _.defaults(inputOptions, options)
}

var resolveContextOptions = (oneOffOptions) => {
  oneOffOptions = _.assignIn(oneOffOptions, options)
  return oneOffOptions
}

var sanitize = (node, contextOptions) => {
  if (!node) {
    return node
  }

  if (!contextOptions) {
    return node
  }

  if (!contextOptions) {
    throw new Error('Option must have values')
  } else {
    var objectSanitizer = contextOptions.objectSanitizer
    if (!objectSanitizer) {
      return node
    } else if (typeof objectSanitizer === 'function') {
      return objectSanitizer(node)
    } else if (typeof objectSanitizer === 'object') {
      if (node.constructor && node.constructor.name) {
        var constructorName = node.constructor.name
        if (objectSanitizer.hasOwnProperty(constructorName) && typeof objectSanitizer[constructorName] === 'function') {
          return objectSanitizer[constructorName](node)
        }
      }
    }
  }
  return node
}

var camelcase = (node, oneOffOptions) => {
  var contextOptions = resolveContextOptions(oneOffOptions)
  if (Array.isArray(node)) {
    return transformArray(node, camelcaseLib, contextOptions)
  } else {
    return transformObject(node, camelcaseLib, contextOptions)
  }
}

var snakecase = (node, oneOffOptions) => {
  var contextOptions = resolveContextOptions(oneOffOptions)
  if (Array.isArray(node)) {
    return transformArray(node, snakeCaseLib, contextOptions)
  } else {
    return transformObject(node, snakeCaseLib, contextOptions)
  }
}

var isArray = (node) => {
  return (Array.isArray && Array.isArray(node)) || Object.prototype.toString.call(node) === '[object Array]'
}

var isInIgnoreClass = (node, contextOptions) => {
  if (node && node.constructor.name && contextOptions.ignoreClass.includes(node.constructor.name)) {
    return true
  }
  return false
}

var isObject = (node) => {
  if (!node) {
    return false
  }
  return typeof node === 'object' || typeof node === 'function'
}

var transformArray = (nodes, f, contextOptions) => {
  return _.map(nodes, (value) => {
    if (isArray(value)) {
      return transformArray(value, f, contextOptions)
    } else if (isObject(value)) {
      if (isInIgnoreClass(value, contextOptions)) {
        return value
      } else {
        return transformObject(value, f, contextOptions)
      }
    } else {
      return value
    }
  })
}

var transformObject = (node, f, contextOptions) => {
  var obj = sanitize(node, contextOptions)
  var newObj = {}

  _.forIn(obj, (value, key) => {
    var transformedKey = f(key)

    if (isArray(value)) {
      newObj[transformedKey] = transformArray(value, f, contextOptions)
    } else if (isObject(value)) {
      if (isInIgnoreClass(value, contextOptions)) {
        newObj[transformedKey] = value
      } else {
        newObj[transformedKey] = transformObject(value, f, contextOptions)
      }
    } else {
      newObj[transformedKey] = value
    }
  })
  return newObj
}

module.exports = {
  option: option,
  camelcase: camelcase,
  snakecase: snakecase
};
