declare module "qrcode" {
  export interface QRCodeOptions {
    width?: number;
    margin?: number;
    scale?: number;
    errorCorrectionLevel?: "low" | "medium" | "quartile" | "high";
    type?: "image/png" | "image/jpeg" | "utf8";
    rendererOpts?: {
      quality?: number;
    };
    color?: {
      dark?: string;  // CSS color (e.g., "#000000ff")
      light?: string; // CSS color (e.g., "#ffffffff")
    };
  }

  export function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>;

  export function toString(
    text: string,
    options?: QRCodeOptions & { type?: "utf8" | "svg" | "terminal" }
  ): Promise<string>;

  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeOptions
  ): Promise<void>;

  export function toFile(
    path: string,
    text: string,
    options?: QRCodeOptions
  ): Promise<void>;
}
