export interface IframeResizerOptions {
  parentOrigin?: string;
  debug?: boolean;
}

export type IframeResizerCleanup = () => void;

export default function initIframeResizer(
  options?: IframeResizerOptions
): IframeResizerCleanup;
