// The two font packages scripts/font-subset.ts uses ship no types.
declare module "subset-font" {
  interface Options {
    targetFormat?: "sfnt" | "truetype" | "woff" | "woff2";
    dropTables?: string[];
    keepFeatures?: string[];
    noHinting?: boolean;
  }
  export default function subsetFont(font: Buffer, text: string, options?: Options): Promise<Buffer>;
}
declare module "fontverter" {
  const fontverter: {
    convert(font: Buffer, to: "sfnt" | "truetype" | "woff" | "woff2"): Promise<Buffer>;
  };
  export default fontverter;
}
