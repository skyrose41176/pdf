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
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import generatePDF from "react-to-pdf";
import { HCardEditing } from "./hcard";

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
        setTemplate(html);
      } catch (error) {
        console.error("Error handling file upload:", error);
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
        />{" "}
        <button
          onClick={() => fileInputRef.current.click()}
          style={{ marginRight: "1rem" }}
        >
          Import File DOCX
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
                  HtmlEmbed
                ],
                toolbar: {
                  items: [
                    'undo', 'redo',
                    '|', 'heading',
                    '|', 'bold', 'italic', 'strikethrough', 'underline',
                    '|', 'bulletedList', 'numberedList',
                    '|', 'outdent', 'indent',
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
                htmlSupport: {
                  allow: [
                    {
                      name: /^.*$/,
                      styles: true,
                      attributes: true,
                      classes: true,
                    },
                  ],
                },
              }}
              onChange={(_, editor) => {
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
