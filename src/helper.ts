import createError from "http-errors";
import fs from "fs";
import { access, readdir, readFile } from "fs/promises";
import { getTime, parse, toDate } from "date-fns";
import pathlib from "path";

export function throwError(err: any) {
  if (err) throw err;
}

/**
 * Parses a time string in HH:mm dd/MM/y format.
 *
 * @param {string} time - time to parse
 * @returns {Date} - equivalent date object
 */
export function parseTime(time: string) {
  return getTime(parse(time, "HH:mm dd/MM/y", new Date()));
}

/**
 * Gets the leaf of the path provided ('/' separated)
 *
 * @param {string} path - the path to segment
 * @returns {string} - the leaf segment of the path
 */
export function getPathLeaf(path: string) {
  return path.split("/").slice(-1)[0];
}

/**
 * Copy a subset of keys from a source object to a destination object in place.
 *
 * @param {object} from - an object to copy keys from
 * @param {object} to - an object to copy keys to (in place)
 * @returns {object} - the resultant object
 */
export function insertKeys(from: object, to: object): object {
  Object.keys(to).forEach((x) => {
    if (Object.keys(from).includes(x))
      to[x as keyof typeof to] = from[x as keyof typeof from];
  });
  return to;
}
