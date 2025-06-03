import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Mustache from "mustache";
import "./App.css";

function App() {
  const [template, setTemplate] = useState("<p>Xin chào {{name}}, bạn {{age}} tuổi.</p>");
  const [rendered, setRendered] = useState("");

  const data = {
    name: "Nguyễn Văn A",
    age: 30,
  };

  const handleRender = () => {
    const result = Mustache.render(template, data);
    setRendered(result);
  };

  return (
    <div className="App" style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>Soạn mẫu với CKEditor</h2>
      <CKEditor
        editor={ClassicEditor}
        data={template}
        onChange={(event, editor) => {
          setTemplate(editor.getData());
        }}
      />

      <button onClick={handleRender} style={{ marginTop: "1rem" }}>
        Render dữ liệu
      </button>

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
