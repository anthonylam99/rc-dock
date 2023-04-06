import { normalize } from "normalizr";

// Don't apply my TypeScript interface because this example is in JavaScript.
/**
export interface ModelSchema {
  entities: any;
  result: any;
}
 */

/**
 * Creates a normalized data scheme containing:
 * - `entities`: an object of objects (i.e. a lookup hashtable) from the array of objects.
 * - `result`: an array of keys from the array of objects, which preserves the array's original order.
 *
 * Accepts an array of objects (which represent a list of database records) in order to generate the scheme.
 * @export
 * @class Model
 */
export class Model {
  // data: any;
  // ids: string;
  // identifier: string;
  // schema: any;

  /**
   * Creates an instance of Model.
   *
   * @param {*} data The array of objects (multiple database records) or a single object (single database record).
   * @param {string} identifier The name of the key to associate `data` with (e.g. the database entity model name).
   * @param {(number | string)} [id] The identifier of the database record, if `data` is a single database record.
   * @memberof Model
   */
  // constructor(data: any, identifier: string, id?: number | string) {
  constructor(data, identifier, id) {
    this.ids = "";
    this.identifier = "";
    this.data = {
      [identifier]: !!id ? [data] : data
    };
  }

  // static ids: string = '';
  // static identifier: string = '';
  // static schema: any;

  static ids = "";
  static identifier = "";
  static schema;

  /**
   * Returns a dictionary according to the normalization structure.
   *
   * @returns {ModelSchema} The schema-transformed data.
   * @memberof Model
   */
  toSchema() {
    const normalizedData = normalize(this.data, this.schema);

    return normalizedData;
  }

  // toSchema(): ModelSchema {
  //   const normalizedData: ModelSchema = normalize(this.data, this.schema);

  //   return normalizedData;
  // }
}
