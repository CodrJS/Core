/**
 * Verify an object has the minimum required parameters AND all parameters are not empty.
 * @param {{[x:string]: any}} params Parameters to test.
 * @param {string[]} required Array of required parameters.
 * @returns {{
 *   passed: boolean,
 *   missing: string[]
 * }} If true; all parameters are present and not empty.
 */
export default function verifyParameters<T extends Record<string, any>>(
  params: T,
  required: string[],
) {
  let passed = true;
  const missing = [];
  for (const p of required) {
    if (Object.prototype.hasOwnProperty.call(params, p)) {
      switch (typeof p) {
        case "string":
          // test if string is empty
          if (params[p] === "") {
            passed = false;
            missing.push(p);
          }
          break;
        case "undefined":
          // test if value is undefined
          passed = false;
          missing.push(p);
          break;
        case "object":
          if (Array.isArray(params[p]) && !params[p].length) {
            passed = false;
            missing.push(p);
          }
          break;
        default:
          // test if null
          if (params[p] === null) {
            passed = false;
            missing.push(p);
          }
      }
    } else {
      passed = false;
      missing.push(p);
    }
  }
  // If everything checks out, return true.
  return {
    passed,
    missing,
  };
}
