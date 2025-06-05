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
  Editor,
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
  Paragraph,
  PendingActions,
  SourceEditing,
  Strikethrough,
  Style,
  Table,
  TableCellProperties,
  TableCellPropertiesEditing,
  TableProperties,
  TablePropertiesEditing,
  TableToolbar,
  Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { renderAsync } from "docx-preview";
import Mustache from "mustache";
import { useEffect, useRef, useState } from "react";
import generatePDF from "react-to-pdf";
import "./App.css";
import { HCardEditing } from "./hcard";
import html2pdf from "html2pdf.js";
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
function App() {
  const [template, setTemplate] = useState<string>(
    "<p>Xin chào {{name}}, bạn {{age}} tuổi.</p>"
  );
  const fileInputRef = useRef<any>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const contactsRef = useRef<HTMLUListElement>(null);
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
    if(targetRef.current)
    targetRef.current.innerHTML = result;
  };
  const handleExportPDF = () => {
    // if (!targetRef.current) {
    //   alert("Vui lòng render dữ liệu trước khi xuất PDF");
    //   return;
    // }
    // generatePDF(targetRef, { filename: "page.pdf" });
    const element = document.getElementById("pdf-content");
  if (element) {
    html2pdf()
      .set({
        margin: 10,
        filename: "document.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  }
  };
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".docx")) {
        alert("Vui lòng chọn một file .docx hợp lệ");
        return;
      }
      try {
        const arrayBuffer = await file.arrayBuffer();
        if (previewRef.current) {
          await renderAsync(arrayBuffer, previewRef.current);
          let html = previewRef.current.innerHTML;
          // html = html.replace(`padding: 30px; `,``);
          editorRef.current?.setData(html);
        }
      } catch (error) {
        console.error("Error handling file upload:", error);
        alert("Có lỗi xảy ra khi xử lý file. Vui lòng thử lại.");
      }
    }
  };

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
                  <p style={{ margin: "0.25rem 0" }}>{contact.title}</p>
                </div>
              </li>
            ))}
          </ul>
          <div
            id="snippet-drag-drop"
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
                    '|', 'clipboard', 'htmlcomment'
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
                htmlEmbed: {
                  showPreviews: true,
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
              }}
              onChange={(_, editor) => {
                const data = editor.getData();
                setTemplate(data);
              }}
              onReady={(editor) => (editorRef.current = editor)}
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
          justifyItems:"center"
        }}
      >
        <html>
          <body>
            <div ref={targetRef} id="pdf-content">

            </div>
          </body>
        </html>
      </div>
      <div ref={previewRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;
