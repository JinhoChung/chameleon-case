import 'babel-polyfill'
import _ from 'lodash'
import camelcaseLib from 'camelcase'
import snakeCaseLib from 'snake-case'

/**
 *
 * TODO : Smart Error Throwing (e.g. Error throwing when Date type processing)
 *
 * TODO : 키 중복되었을때 해결 https://github.com/claudetech/js-change-object-case/blob/master/index.js#L69
 *
 * TODO : 각 object 별 커스터마이징 resolve 메소드 받을것 (예: moment)
 *
 */

let mongooseObjectSanitizer = (node) => {
  let needToMakeObjectFirst = ['model', 'EmbeddedDocument']
  let needToOmitFields = ['_id', '__v']

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

let option = (inputOptions) => {
  options = _.defaults(inputOptions, options)
}

let resolveContextOptions = (oneOffOptions) => {
  oneOffOptions = _.assignIn(oneOffOptions, options)
  return oneOffOptions
}

let sanitize = (node, contextOptions) => {
  if (!node) {
    return node
  }

  if (!contextOptions) {
    return node
  }

  if (!contextOptions) {
    throw new Error('Option must have values')
  } else {
    let objectSanitizer = contextOptions.objectSanitizer
    if (!objectSanitizer) {
      return node
    } else if (typeof objectSanitizer === 'function') {
      return objectSanitizer(node)
    } else if (typeof objectSanitizer === 'object') {
      if (node.constructor && node.constructor.name) {
        let constructorName = node.constructor.name
        if (objectSanitizer.hasOwnProperty(constructorName) && typeof objectSanitizer[constructorName] === 'function') {
          return objectSanitizer[constructorName](node)
        }
      }
    }
  }
  return node
}

let camelcase = (node, oneOffOptions) => {
  let contextOptions = resolveContextOptions(oneOffOptions)
  if (Array.isArray(node)) {
    return transformArray(node, camelcaseLib, contextOptions)
  } else {
    return transformObject(node, camelcaseLib, contextOptions)
  }
}

let snakecase = (node, oneOffOptions) => {
  let contextOptions = resolveContextOptions(oneOffOptions)
  if (Array.isArray(node)) {
    return transformArray(node, snakeCaseLib, contextOptions)
  } else {
    return transformObject(node, snakeCaseLib, contextOptions)
  }
}

let isArray = (node) => {
  return (Array.isArray && Array.isArray(node)) || Object.prototype.toString.call(node) === '[object Array]'
}

let isInIgnoreClass = (node, contextOptions) => {
  if (node && node.constructor.name && contextOptions.ignoreClass.includes(node.constructor.name)) {
    return true
  }
  return false
}

let isObject = (node) => {
  if (!node) {
    return false
  }
  return typeof node === 'object' || typeof node === 'function'
}

let transformArray = (nodes, f, contextOptions) => {
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

let transformObject = (node, f, contextOptions) => {
  let obj = sanitize(node, contextOptions)
  let newObj = {}

  _.forIn(obj, (value, key) => {
    let transformedKey = f(key)

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

export default {
  option,
  camelcase,
  snakecase
}
