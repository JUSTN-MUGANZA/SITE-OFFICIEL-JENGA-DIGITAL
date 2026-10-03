import { describe, expect, it } from "vitest";
import { serialize } from "./serialize";

describe("serialize", () => {
  it("convertit les timestamps imbriqués", () => {
    const ts = { toDate: () => new Date("2026-10-03T10:00:00Z") };
    expect(serialize({ a: ts, list: [{ b: ts }], n: 1, s: "x", nil: null })).toEqual({
      a: "2026-10-03T10:00:00.000Z",
      list: [{ b: "2026-10-03T10:00:00.000Z" }],
      n: 1,
      s: "x",
      nil: null,
    });
  });
});
