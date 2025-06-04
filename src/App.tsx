import mammoth from "mammoth";
import Mustache from "mustache";
import { useRef, useState } from "react";
import "./App.css";
// import { ckeditorConfig } from "./ckeditor";
// import ClassicEditor  from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Mention, Image, Clipboard } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
// Define mention items
const mentionItems = [
  { id: '@name', text: '{{name}}' },
  { id: '@age', text: '{{age}}' },
  { id: '@email', text: '{{email}}' },
  { id: '@phone', text: '{{phone}}' },
  { id: '@address', text: '{{address}}' },

];

function App() {
  const [template, setTemplate] = useState<string>(
    "<p>Xin chào {{name}}, bạn {{age}} tuổi.</p>"
  );
  const [rendered, setRendered] = useState("");
  const fileInputRef = useRef<any>(null);

  const data = {
    name: "Nguyễn Văn A",
    age: 30,
  };

  const handleRender = () => {
    const result = Mustache.render(template, data);
    setRendered(result);
  };

  const convertDocxToHtml = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      let html = result.value;

      // Clean up HTML to be compatible with CKEditor
      html = html
        // Remove any style attributes that might cause issues
        .replace(/ style="[^"]*"/g, "")
        // Remove any class attributes
        .replace(/ class="[^"]*"/g, "")
        // Remove any script tags
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        // Remove any iframe tags
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
        // Remove any style tags
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        // Remove any meta tags
        .replace(/<meta\b[^>]*>/gi, "")
        // Remove any link tags
        .replace(/<link\b[^>]*>/gi, "")
        // Remove any head tags and their content
        .replace(/<head\b[^<]*(?:(?!<\/head>)<[^<]*)*<\/head>/gi, "")
        // Remove any body tags but keep their content
        .replace(/<\/?body[^>]*>/gi, "")
        // Remove any html tags but keep their content
        .replace(/<\/?html[^>]*>/gi, "")
        // Remove any doctype declarations
        .replace(/<!DOCTYPE[^>]*>/gi, "")
        // Remove any comments
        .replace(/<!--[\s\S]*?-->/g, "")
        // Remove any empty paragraphs
        .replace(/<p>\s*<\/p>/g, "")
        // Remove any multiple line breaks
        .replace(/(\r\n|\n|\r)/gm, "")
        // Remove any multiple spaces
        .replace(/\s+/g, " ")
        // Trim the result
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

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Soạn mẫu với CKEditor</h2>

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
        <button onClick={handleRender}>Render dữ liệu</button>
      </div>

      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "600px",
          marginBottom: "1rem",
        }}
      >
        <CKEditor
            editor={ ClassicEditor }
            config={ {
                licenseKey: 'GPL',
                plugins: [ Essentials, Paragraph, Bold, Italic ,Mention,Image,Clipboard],
                toolbar: [ 'undo', 'redo', '|', 'bold', 'italic', '|' ,'clipboard','mention'],
                initialData: '<p>Hello from CKEditor 5 in React!</p>',
                mention: {
                  feeds: [
                    {
                      marker: '@',
                      feed: mentionItems.map(item => item.id),
                      minimumCharacters: 1,
                      itemRenderer: (item: any) => {
                        // This function controls how the suggestion looks in the dropdown
                        const div = document.createElement('div');
                        // Display just the variable name (e.g., 'name', 'age') in the dropdown
                        // We can extract this from the text property '{{name}}' -> 'name'
                        // const variableName = item.text.replace(/^{{\s*|\s*}}$/g, '');
                        div.textContent = mentionItems.find(men => men.id === item)?.text ?? "";
                        return div;
                      }
                    }
                  ]
                }
            } }
        />
      </div>

      <h2>Kết quả:</h2>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginTop: "1rem",
          backgroundColor: "#f9f9f9",
        }}
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
    </div>
  );
}


export default App;
