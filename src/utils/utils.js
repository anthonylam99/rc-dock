import transform from "lodash/transform";
import isEqual from "lodash/isEqual";
import isObject from "lodash/isObject";

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference(object, base) {
  function changes(object, base) {
    return transform(object, function(result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}

export function selectDeepestChild(lookup) {}

/*
export function selectDeepestChild(lookup) {
  const { children } = lookup;
  console.log("children", children);
  const [child1, child2] = children.filter(child => child);
  const child = child2 ? child2 : child1;
  console.log("child1", child1);
  console.log("child2", child2);

  if (!child) {
    return child;
  }

  if (!!child.children) {
    return selectDeepestChild(child);
  }

  return child;
}
*/
