declare module 'html2pdf.js' {
  interface Options {
    margin?: number | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
    };
    jsPDF?: {
      unit?: string;
      format?: string | [number, number];
      orientation?: 'portrait' | 'landscape';
    };
  }

  interface Html2PdfInstance {
    set(options: Options): Html2PdfInstance;
    from(element: HTMLElement): Html2PdfInstance;
    save(): Promise<void>;
    toPdf(): Html2PdfInstance;
    toContainer(): Html2PdfInstance;
    toCanvas(): Html2PdfInstance;
    toImg(): Html2PdfInstance;
    outputPdf(): Promise<Uint8Array>;
    outputImg(): Promise<string>;
  }

  function html2pdf(): Html2PdfInstance;
  function html2pdf(element: HTMLElement, options?: Options): Html2PdfInstance;
  function html2pdf(options?: Options): Html2PdfInstance;

  export = html2pdf;
} 