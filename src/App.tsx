import mammoth from "mammoth";
import Mustache from "mustache";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";

import {
  Alignment,
  AlignmentEditing,
  BlockQuote,
  Bold,
  ClassicEditor,
  Clipboard,
  DragDrop,
  DragDropBlockToolbar,
  Essentials,
  Font,
  FontBackgroundColor,
  FontColor,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  HtmlComment,
  HtmlEmbed,
  Image,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageUploadEditing,
  ImageUploadProgress,
  Indent,
  Italic,
  Link,
  List,
  ListProperties,
  Mention,
  Paragraph,
  SourceEditing,
  Strikethrough,
  Table,
  TableCellProperties,
  TableCellPropertiesEditing,
  TableProperties,
  TablePropertiesEditing,
  TableToolbar,
  Underline,
  PendingActions, 
  Style,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import generatePDF from "react-to-pdf";
import { HCardEditing } from "./hcard";
import JSZip from 'jszip';
// Define mention items
const mentionItems = [
  { id: "@name", text: "{{name}}" },
  { id: "@age", text: "{{age}}" },
  { id: "@email", text: "{{email}}" },
  { id: "@phone", text: "{{phone}}" },
  { id: "@address", text: "{{address}}" },
];

function App() {
  const [template, setTemplate] = useState<string>(
    "<p>Xin chào {{name}}, bạn {{age}} tuổi.</p>"
  );
  const [rendered, setRendered] = useState("");
  const fileInputRef = useRef<any>(null);
  const htmlFileInputRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    age: 30,
    phone: "0965956046",
    direct: "62A cách mạng tháng 8",
    birth: "23/12/2001",
    sex: "Nam",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const W_NAMESPACE = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

function halfPointsToPx(halfPoints: string) {
  return Math.round(parseInt(halfPoints) * 0.6667);
}

function cssObjectToString(cssObj: Record<string, string>) {
  return Object.entries(cssObj)
    .map(([k, v]) => {
      // Nếu là chuỗi text (không phải số hay màu), thì mới cần bọc ""
      // const shouldQuote = !/^\d+(px|em|rem|%)?$/.test(v) && !/^#/.test(v);
      if(v == "#auto"){
      return `${k}: ${`"${v}"`};`;

      }
      return `${k}: ${`${v}`};`;

      // return `${k}: ${shouldQuote ? `"${v}"` : v};`;
    })
    .join(" ");
}
  const extractStylesXml = async (file:File) => {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
  
    const stylesXml = await zip.file("word/styles.xml")?.async("string");
    if (!stylesXml) {
      console.error("Không tìm thấy styles.xml trong file docx");
      return;
    }
  
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(stylesXml, "text/xml");
  
    const styles = [...xmlDoc.getElementsByTagName("w:style")];

  
  const styleInfos = styles.map((style,index) => {
    const styleId = style.getAttribute("w:styleId");
    const type = style.getAttribute("w:type"); // paragraph, character, table
    const nameNode = style.getElementsByTagName("w:name")[0];
    const name = nameNode?.getAttribute("w:val") || styleId;

    const tagMapping = {
      paragraph: "p",
      character: "span",
      table: "table",
      number: "ol"
    } as const;
    
    type StyleType = keyof typeof tagMapping;
    
    let tagName = "div"; // fallback mặc định
    
    if (type && type in tagMapping) {
      tagName = tagMapping[type as StyleType];
    } // fallback nếu không có mapping
// Phân tích thuộc tính CSS từ w:rPr và w:pPr
const cssObj: Record<string, string> = {};

// Run properties
const rPr = style.getElementsByTagName("w:rPr")[0];
if (rPr) {
  const sz = rPr.getElementsByTagName("w:sz")[0];
  if (sz) cssObj["font-size"] = halfPointsToPx(sz.getAttribute("w:val") || "24") + "px";

  const b = rPr.getElementsByTagName("w:b")[0];
  if (b) cssObj["font-weight"] = "bold";

  const i = rPr.getElementsByTagName("w:i")[0];
  if (i) cssObj["font-style"] = "italic";

  const color = rPr.getElementsByTagName("w:color")[0];
  if (color) cssObj["color"] = "#" + color.getAttribute("w:val");
}
// Paragraph properties
const pPr = style.getElementsByTagName("w:pPr")[0];
if (pPr) {
  const spacing = pPr.getElementsByTagName("w:spacing")[0];
  if (spacing) {
    if (spacing.getAttribute("w:before")) {
      cssObj["margin-top"] = halfPointsToPx(spacing.getAttribute("w:before") || "0") + "px";
    }
    if (spacing.getAttribute("w:after")) {
      cssObj["margin-bottom"] = halfPointsToPx(spacing.getAttribute("w:after") || "0") + "px";
    }
  }
  const jc = pPr.getElementsByTagName("w:jc")[0];
  const alignMap: Record<string, string> = {
    left: "left",
    center: "center",
    right: "right",
    both: "justify"
  };

  if (jc) {
    const alignVal = jc.getAttribute("w:val");
    if (alignVal && alignMap[alignVal]) {
      cssObj["text-align"] = alignMap[alignVal];
    }
  }
}
    return { styleId, name, type, tagName,index ,cssObj };
  });
  const cssContent = styleInfos
    .map(({ styleId, cssObj }) => `.${styleId} { ${cssObjectToString(cssObj)} }`)
    .join("\n");
  return {styleInfos,cssContent};
  };
  const handleRender = () => {
    const result = Mustache.render(template, formData);
    setRendered(result);
  };

  const targetRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = () => {
    if (!rendered) {
      alert("Vui lòng render dữ liệu trước khi xuất PDF");
      return;
    }
    generatePDF(targetRef, { filename: "page.pdf" });
  };
  const mapStyleDefinitionsToHtml =(html:string, styleInfos:any[]) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    styleInfos.forEach(({ tagName, styleId, index }) => {
      // Lấy thẻ theo tagName và index thứ tự
      const elements = doc.querySelectorAll(tagName);
  
      // Chỉ gắn class vào thẻ thứ `index` trong list thẻ đó
      const el = elements[index];
      if (el) {
        el.classList.add(styleId); // hoặc class tương ứng
        // Có thể gắn thêm attribute để đánh dấu index
        el.setAttribute("data-style-index", index.toString());
      }
    });
  
    return doc.body.innerHTML;
  }
  const convertDocxToHtml = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      let html = result.value;
      // Clean up HTML to be compatible with CKEditor
      html = html
        // // Remove any style attributes that might cause issues
        // .replace(/ style="[^"]*"/g, "")
        // // Remove any class attributes
        // .replace(/ class="[^"]*"/g, "")
        // // Remove any script tags
        // .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        // // Remove any iframe tags
        // .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        // // Remove any style tags
        // .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        // // Remove any meta tags
        // .replace(/<meta\b[^>]*>/gi, "")
        // // Remove any link tags
        // .replace(/<link\b[^>]*>/gi, "")
        // // Remove any head tags and their content
        // .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "")
        // // Remove any body tags but keep their content
        // .replace(/<\/?body[^>]*>/gi, "")
        // // Remove any html tags but keep their content
        // .replace(/<\/?html[^>]*>/gi, "")
        // // Remove any doctype declarations
        // .replace(/<!DOCTYPE[^>]*>/gi, "")
        // // Remove any comments
        // .replace(/<!--[\s\S]*?-->/g, "")
        // // Remove any empty paragraphs
        // .replace(/<p>\s*<\/p>/g, "")
        // // Remove any multiple line breaks
        // .replace(/(\r\n|\n|\r)/gm, "")
        // // Remove any multiple spaces
        // .replace(/\s+/g, " ")
        // // Trim the result
        .trim();

      // If the content is empty after cleaning, return a default paragraph
      if (!html) {
        html =
          "<p>Không thể đọc nội dung file. Vui lòng kiểm tra lại file của bạn.</p>";
      }
      console.log(html);
      return html;
    } catch (error) {
      console.error("Error converting DOCX to HTML:", error);
      return "<p>Lỗi khi chuyển đổi file. Vui lòng thử lại.</p>";
    }
  };


  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".docx")) {
        alert("Vui lòng chọn một file .docx hợp lệ");
        return;
      }
      try {
        const html = await convertDocxToHtml(file);
        const styleDefinitions = await extractStylesXml(file);
        const htmlWithClasses = mapStyleDefinitionsToHtml(html, styleDefinitions?.styleInfos ??[]);
        
        const headerContent =`
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
      rel="stylesheet"
    />
    <style>
      ${styleDefinitions?.cssContent}
    </style>
    <title>Email gửi từ Hệ thống Định Giá Tài Sản (AVM)</title>
  </head>
`
        const docs =`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>`
              setTemplate(docs +  headerContent + `  <body
          class="body"
          style="
            font-family: Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue,
              sans-serif;
            font-size: 13px;
          "
        >`+htmlWithClasses + ` </body>
      </html>`);
      // setTemplate(htmlWithClasses);
      } catch (error) {
        console.error("Error handling file upload:", error);
        alert("Có lỗi xảy ra khi xử lý file. Vui lòng thử lại.");
      }
    }
  };

  const handleHtmlFileUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".html")) {
        alert("Vui lòng chọn một file .html hợp lệ");
        return;
      }
      try {
        const text = await file.text();
        setTemplate(text);
      } catch (error) {
        console.error("Error handling HTML file upload:", error);
        alert("Có lỗi xảy ra khi xử lý file. Vui lòng thử lại.");
      }
    }
  };

  const contacts = [
    {
      title: "Tên",
      key: "{{ name }}",
    },
    {
      title: "Tuổi",
      key: "{{ age }}",
    },
    {
      title: "Số điện thoại",
      key: "{{ phone }}",
    },
    {
      title: "Địa chỉ",
      key: "{{ direct }}",
    },
    {
      title: "Ngày sinh",
      key: "{{ birth }}",
    },
    {
      title: "Giới tính",
      key: "{{ sex }}",
    },
  ];
  const contactsRef = useRef<HTMLUListElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const draggable = target.closest("[draggable]");
      if (!draggable) return;

      const dataContact = (draggable as HTMLElement).getAttribute(
        "data-contact"
      );
      if (dataContact === null) return;

      event.dataTransfer?.setData("text/plain", draggable.textContent || "");
      event.dataTransfer?.setData("text/html", draggable.innerHTML);
      event.dataTransfer?.setData(
        "contact",
        JSON.stringify(contacts[Number(dataContact)])
      );
      event.dataTransfer?.setDragImage(draggable, 0, 0);
    };

    const current = contactsRef.current;
    if (current) {
      current.addEventListener("dragstart", handleDragStart as EventListener);
    }
    return () => {
      if (current) {
        current.removeEventListener(
          "dragstart",
          handleDragStart as EventListener
        );
      }
    };
  }, []);
  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Soạn mẫu với CKEditor</h2>

      {/* Add Form Component */}
      <div style={{ 
        marginBottom: "2rem", 
        padding: "1rem", 
        border: "1px solid #ccc", 
        borderRadius: "4px",
        backgroundColor: "#f9f9f9"
      }}>
        <h3>Thông tin cá nhân</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Họ và tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Tuổi:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Địa chỉ:</label>
            <input
              type="text"
              name="direct"
              value={formData.direct}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Ngày sinh:</label>
            <input
              type="text"
              name="birth"
              value={formData.birth}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Giới tính:</label>
            <input
              type="text"
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="file"
          accept=".docx"
          onChange={handleFileUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        <input
          type="file"
          accept=".html"
          onChange={handleHtmlFileUpload}
          ref={htmlFileInputRef}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          style={{ marginRight: "1rem" }}
        >
          Import File DOCX
        </button>
        <button
          onClick={() => htmlFileInputRef.current.click()}
          style={{ marginRight: "1rem" }}
        >
          Import File HTML
        </button>
        <button onClick={handleRender} style={{ marginRight: "1rem" }}>
          Render dữ liệu
        </button>
        <button onClick={handleExportPDF}>Xuất PDF</button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "800px",
          marginBottom: "1rem",
          width: "100vh",
        }}
      >
        <style>
          {`
            .ck-editor__editable {
              min-height: 700px !important;
              max-height: 700px !important;
              overflow-y: auto !important;
            }
          `}
        </style>
        <div className="drag-drop-demo" style={{ display: "flex" }}>
          <ul
            className="contacts"
            ref={contactsRef}
            style={{ listStyle: "none", padding: "10px", margin: 0 }}
          >
            {contacts.map((contact, id) => (
              <li key={id}>
                <div
                  className="contact "
                  data-contact={id}
                  draggable="true"
                  style={{
                    border: "1px solid #ddd",
                    padding: "1rem",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    alignItems: "center",
                    marginBottom: 8,
                    cursor: "grab",
                  }}
                >
                  {/* <h4 style={{ margin: "0 0 0.5rem 0" }}>{contact.name}</h4>
                  <p style={{ margin: "0.25rem 0" }}>📧 {contact.email}</p>
                  <p style={{ margin: "0.25rem 0" }}>📞 {contact.tel}</p> */}
                  <p style={{ margin: "0.25rem 0" }}>📧 {contact.title}</p>
                </div>
              </li>
            ))}
          </ul>
          <div
            id="snippet-drag-drop"
            ref={editorRef}
            style={{ flex: 1, minHeight: 200, border: "1px solid #ccc" }}
          >
            <CKEditor
              editor={ClassicEditor}
              data={template}
              config={{
                licenseKey: "GPL",
                plugins: [
                  Style,
                  Essentials,
                  Paragraph,
                  Bold,
                  Italic,
                  Strikethrough,
                  Underline,
                  Heading,
                  List,
                  ListProperties,
                  Indent,
                  Link,
                  BlockQuote,
                  Table,
                  TableToolbar,
                  TableProperties,
                  TableCellProperties,
                  TablePropertiesEditing,
                  TableCellPropertiesEditing,
                  Image,
                  ImageUpload,
                  ImageUploadEditing,
                  ImageUploadProgress,
                  ImageStyle,
                  ImageToolbar,
                  ImageResize,
                  Font,
                  FontColor,
                  FontBackgroundColor,
                  Alignment,
                  AlignmentEditing,
                  Mention,
                  Clipboard,
                  DragDrop,
                  DragDropBlockToolbar,
                  HCardEditing,
                  SourceEditing,
                  GeneralHtmlSupport,
                  HtmlComment,
                  FullPage,
                  HtmlEmbed,
                  PendingActions
                ],
                toolbar: {
                  items: [
                    'undo', 'redo',
                    '|', 'heading',
                    '|', 'bold', 'italic', 'strikethrough', 'underline',
                    '|', 'bulletedList', 'numberedList',
                    '|', 'outdent', 'indent',
                    '|', 'style',
                    '|', 'link', 'blockQuote', 'insertTable', 'imageUpload',
                    '|', 'fontColor', 'fontBackgroundColor',
                    '|', 'alignment',
                    '|','sourceEditing',
                    '|','htmlComment',
                    '|','fullPage',
                    '|','htmlEmbed',
                    '|', 'clipboard', 'mention', 'htmlcomment'
                  ],
                  shouldNotGroupWhenFull: true
                },
                table: {
                  contentToolbar: [
                    'tableColumn',
                    'tableRow',
                    'mergeTableCells',
                    'tableProperties',
                    'tableCellProperties'
                  ]
                },
                image: {
                  toolbar: [
                    'imageStyle:inline',
                    'imageStyle:block',
                    'imageStyle:side',
                    '|',
                    'toggleImageCaption',
                    'imageTextAlternative',
                    '|',
                    'resizeImage'
                  ],
                  resizeOptions: [
                    {
                      name: 'resizeImage:original',
                      value: null,
                      label: 'Original'
                    },
                    {
                      name: 'resizeImage:50',
                      value: '50',
                      label: '50%'
                    },
                    {
                      name: 'resizeImage:75',
                      value: '75',
                      label: '75%'
                    }
                  ],
                  resizeUnit: '%'
                },
                mention: {
                  feeds: [
                    {
                      marker: "@",
                      feed: mentionItems.map((item) => item.id),
                      minimumCharacters: 1,
                    },
                  ],
                },
                htmlEmbed: {
                  showPreviews: true,
                  // sanitizeHtml: ( inputHtml ) => {
                  //     // Strip unsafe elements and attributes, for example:
                  //     // the `<script>` elements and `on*` attributes.
                  //     const outputHtml = sanitize( inputHtml );
      
                  //     return {
                  //         html: outputHtml,
                  //         // true or false depending on whether the sanitizer stripped anything.
                  //         hasChanged: true
                  //     };
                  // }
                },
                
                htmlSupport: {
                  allow: [
                    {
                      name: /^.*$/,
                      styles: true,
                      attributes: true,
                      classes: true
                    }
                  ],
                  
                },
                contentsCss:'./docx-styles.css'                // style: {
                //   definitions: styleDefinitions
                  
                // }
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTemplate(data);
              }}
            />
          </div>
        </div>
      </div>

      <h2>Kết quả:</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginTop: "1rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div ref={targetRef} dangerouslySetInnerHTML={{ __html: rendered }} />
      </div>
    </div>
  );
}

export default App;
