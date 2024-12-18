export function empty(value: number | string | any) {
  if (typeof value != "number" && typeof value != "string") {
    return value == null || value == undefined;
  }

  const str = ("" + value).trim();
  return str != "";
}
