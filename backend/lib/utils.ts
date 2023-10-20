
function clone(obj) {
    var p, s;

    if (obj === null) return obj;
    if (typeof obj !== 'object') return obj;

    if (obj instanceof RegExp) {
        return obj;
    } else if (obj.constructor === Array) {
        s = [];
        for (var i = 0; i < obj.length; i++) s.push(obj[i]);
    } else {
        s = {};
        for (p in obj) if (Object.prototype.hasOwnProperty.call(obj, p)) s[p] = clone(obj[p]);
    }

    return s;
}


function merge(original, target) {
    if (target === void 0 || target === null) return clone(original);
    if (original === void 0 || original === null) return target;

    for (var p in original) {
        if (Object.prototype.hasOwnProperty.call(original, p)) {
            const v = original[p];
            if (v instanceof Array) {
                if (v !== void 0 && v !== null) target[p] = clone(v);
            } else if (typeof v === 'object') {
                target[p] = merge(v, target[p]);
            } else {
                if (typeof v !== 'undefined') target[p] = clone(v);
            }
        }
    }

    return target;
}


/*
    str: /{key1}/{key2} 
    obj: {key1: 'a', key2: 'b'}
    result: '/a/b'
*/
function formatString(str, obj) {
    if (!str || str === '' || !obj) {
        return str;
    }
    let result = str;
    let ret, pattern;

    Object.keys(obj).forEach(x => {
        ret = new RegExp(`{${x}}`, 'ig').exec(result);

        if (ret && ret.length >= 1) {
            pattern = ret[0];
            result = result.replace(pattern, obj[x]);
        }
    });

    return result;
}


function encodeQuery(queryStr) {
    if (!queryStr || queryStr === '') {
        return queryStr;
    }

    if (queryStr.indexOf('?') === 0) {
        queryStr = queryStr.substr(1);
    }

    const queries = queryStr.split('&');
    const queriesLen = queries.length;

    let item,
        kvs,
        result = '';
    for (let i = 0; i < queries.length; i++) {
        item = queries[i];

        if (!item || item === '') {
            continue;
        }

        kvs = item.split('=');
        if (kvs.length === 2) {
            result += `${kvs[0]}=${encodeURIComponent(kvs[1])}`;
        } else {
            result += kvs[0];
        }

        if (i + 1 === queriesLen) {
            continue;
        }
        result += '&';
    }

    return result;
}


export default {
    clone,
    merge,
    formatString,
    encodeQuery
}
