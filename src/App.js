"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ckeditor5_react_1 = require("@ckeditor/ckeditor5-react");
var ckeditor5_1 = require("ckeditor5");
require("ckeditor5/ckeditor5.css");
var docx_preview_1 = require("docx-preview");
var html2pdf_js_1 = require("html2pdf.js");
var mustache_1 = require("mustache");
var react_1 = require("react");
require("./App.css");
var hcard_1 = require("./hcard");
var contacts = [
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
    var _this = this;
    var _a = (0, react_1.useState)("<p>Xin chào {{name}}, bạn {{age}} tuổi.</p>"), template = _a[0], setTemplate = _a[1];
    var fileInputRef = (0, react_1.useRef)(null);
    var targetRef = (0, react_1.useRef)(null);
    var previewRef = (0, react_1.useRef)(null);
    var editorRef = (0, react_1.useRef)(null);
    var contactsRef = (0, react_1.useRef)(null);
    var _b = (0, react_1.useState)({
        name: "Nguyễn Văn A",
        age: 30,
        phone: "0965956046",
        direct: "62A cách mạng tháng 8",
        birth: "23/12/2001",
        sex: "Nam",
    }), formData = _b[0], setFormData = _b[1];
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleRender = function () {
        var result = mustache_1.default.render(template, formData);
        if (targetRef.current)
            targetRef.current.innerHTML = result;
    };
    var handleExportPDF = function () {
        var element = document.getElementById("pdf-content");
        if (element) {
            (0, html2pdf_js_1.default)()
                .set({
                margin: [10, 10, 10, 10], // tránh margin 0 làm mất nội dung
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true }, // useCORS để hỗ trợ ảnh ngoài
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'], // Tự động chia trang
                    before: '.page-break-before', // Bắt đầu trang mới trước thẻ này
                    after: '.page-break-after', // Trang mới sau thẻ này
                    avoid: ['.avoid-break', 'table'] // Tránh cắt giữa các phần tử
                }
            })
                .from(element)
                .save();
        }
    };
    var handleFileUpload = function (event) { return __awaiter(_this, void 0, void 0, function () {
        var file, arrayBuffer, html, error_1;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    file = (_b = (_a = event.target) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
                    if (!file) return [3 /*break*/, 6];
                    if (!file.name.toLowerCase().endsWith(".docx")) {
                        alert("Vui lòng chọn một file .docx hợp lệ");
                        return [2 /*return*/];
                    }
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, file.arrayBuffer()];
                case 2:
                    arrayBuffer = _d.sent();
                    if (!previewRef.current) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, docx_preview_1.renderAsync)(arrayBuffer, previewRef.current)];
                case 3:
                    _d.sent();
                    html = previewRef.current.innerHTML;
                    (_c = editorRef.current) === null || _c === void 0 ? void 0 : _c.setData(html);
                    _d.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _d.sent();
                    console.error("Error handling file upload:", error_1);
                    alert("Có lỗi xảy ra khi xử lý file. Vui lòng thử lại.");
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useEffect)(function () {
        var handleDragStart = function (event) {
            var _a, _b, _c, _d;
            var target = event.target;
            if (!target)
                return;
            var draggable = target.closest("[draggable]");
            if (!draggable)
                return;
            var dataContact = draggable.getAttribute("data-contact");
            if (dataContact === null)
                return;
            (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData("text/plain", draggable.textContent || "");
            (_b = event.dataTransfer) === null || _b === void 0 ? void 0 : _b.setData("text/html", draggable.innerHTML);
            (_c = event.dataTransfer) === null || _c === void 0 ? void 0 : _c.setData("contact", JSON.stringify(contacts[Number(dataContact)]));
            (_d = event.dataTransfer) === null || _d === void 0 ? void 0 : _d.setDragImage(draggable, 0, 0);
        };
        var current = contactsRef.current;
        if (current) {
            current.addEventListener("dragstart", handleDragStart);
        }
        return function () {
            if (current) {
                current.removeEventListener("dragstart", handleDragStart);
            }
        };
    }, []);
    return (<div className="App" style={{ padding: "2rem", fontFamily: "Arial" }}>
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
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ width: "100%", padding: "0.5rem" }}/>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Tuổi:</label>
            <input type="number" name="age" value={formData.age} onChange={handleInputChange} style={{ width: "100%", padding: "0.5rem" }}/>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Số điện thoại:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: "100%", padding: "0.5rem" }}/>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Địa chỉ:</label>
            <input type="text" name="direct" value={formData.direct} onChange={handleInputChange} style={{ width: "100%", padding: "0.5rem" }}/>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Ngày sinh:</label>
            <input type="text" name="birth" value={formData.birth} onChange={handleInputChange} style={{ width: "100%", padding: "0.5rem" }}/>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Giới tính:</label>
            <input type="text" name="sex" value={formData.sex} onChange={handleInputChange} style={{ width: "100%", padding: "0.5rem" }}/>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <input type="file" accept=".docx" onChange={handleFileUpload} ref={fileInputRef} style={{ display: "none" }}/>
       
        <button onClick={function () { return fileInputRef.current.click(); }} style={{ marginRight: "1rem" }}>
          Import File DOCX
        </button>
        <button onClick={handleRender} style={{ marginRight: "1rem" }}>
          Render dữ liệu
        </button>
        <button onClick={handleExportPDF}>Xuất PDF</button>
      </div>
      <div style={{
            border: "1px solid #ccc",
            minHeight: "800px",
            marginBottom: "1rem",
            width: "100vh",
        }}>
        <style>
          {"\n            .ck-editor__editable {\n              min-height: 700px !important;\n              max-height: 700px !important;\n              overflow-y: auto !important;\n            }\n          "}
        </style>
        <div className="drag-drop-demo" style={{ display: "flex" }}>
          <ul className="contacts" ref={contactsRef} style={{ listStyle: "none", padding: "10px", margin: 0 }}>
            {contacts.map(function (contact, id) { return (<li key={id}>
                <div className="contact " data-contact={id} draggable="true" style={{
                border: "1px solid #ddd",
                padding: "1rem",
                borderRadius: "4px",
                backgroundColor: "white",
                alignItems: "center",
                marginBottom: 8,
                cursor: "grab",
            }}>
                  <p style={{ margin: "0.25rem 0" }}>{contact.title}</p>
                </div>
              </li>); })}
          </ul>
          <div id="snippet-drag-drop" style={{ flex: 1, minHeight: 200, border: "1px solid #ccc" }}>
            <ckeditor5_react_1.CKEditor editor={ckeditor5_1.ClassicEditor} data={template} config={{
            licenseKey: "GPL",
            language: 'vi',
            plugins: [
                ckeditor5_1.Style,
                ckeditor5_1.Essentials,
                ckeditor5_1.Paragraph,
                ckeditor5_1.Bold,
                ckeditor5_1.Italic,
                ckeditor5_1.Strikethrough,
                ckeditor5_1.Underline,
                ckeditor5_1.Heading,
                ckeditor5_1.List,
                ckeditor5_1.ListProperties,
                ckeditor5_1.Indent,
                ckeditor5_1.Link,
                ckeditor5_1.BlockQuote,
                ckeditor5_1.Table,
                ckeditor5_1.TableToolbar,
                ckeditor5_1.TableProperties,
                ckeditor5_1.TableCellProperties,
                ckeditor5_1.TablePropertiesEditing,
                ckeditor5_1.TableCellPropertiesEditing,
                ckeditor5_1.Image,
                ckeditor5_1.ImageUpload,
                ckeditor5_1.ImageUploadEditing,
                ckeditor5_1.ImageUploadProgress,
                ckeditor5_1.ImageStyle,
                ckeditor5_1.ImageToolbar,
                ckeditor5_1.ImageResize,
                ckeditor5_1.ImageResizeEditing,
                ckeditor5_1.ImageResizeHandles,
                ckeditor5_1.LinkImage,
                ckeditor5_1.Font,
                ckeditor5_1.FontColor,
                ckeditor5_1.FontBackgroundColor,
                ckeditor5_1.Alignment,
                ckeditor5_1.AlignmentEditing,
                ckeditor5_1.Clipboard,
                ckeditor5_1.DragDrop,
                ckeditor5_1.DragDropBlockToolbar,
                hcard_1.HCardEditing,
                ckeditor5_1.SourceEditing,
                ckeditor5_1.GeneralHtmlSupport,
                ckeditor5_1.HtmlComment,
                ckeditor5_1.FullPage,
                ckeditor5_1.HtmlEmbed,
                ckeditor5_1.PendingActions,
                ckeditor5_1.AutoImage
            ],
            toolbar: {
                items: [
                    'undo', 'redo',
                    '|', 'heading',
                    '|', 'bold', 'italic', 'strikethrough', 'underline',
                    '|', 'bulletedList', 'numberedList',
                    '|', 'outdent', 'indent',
                    '|', 'style',
                    '|', 'link', 'blockQuote', 'insertTable', 'insertImage', 'resizeImage',
                    '|', 'fontColor', 'fontBackgroundColor',
                    '|', 'alignment',
                    '|', 'sourceEditing',
                    '|', 'htmlComment',
                    '|', 'fullPage',
                    '|', 'htmlEmbed',
                    '|', 'clipboard', 'htmlcomment',
                    '|', 'ckboxImageEdit'
                ],
                // shouldNotGroupWhenFull: true
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
                    'ckboxImageEdit',
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
                        name: 'resizeImage:custom',
                        value: 'custom',
                        icon: 'custom'
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
                resizeUnit: '%',
                insert: {
                    // This is the default configuration, you do not need to provide
                    // this configuration key if the list content and order reflects your needs.
                    type: 'auto',
                    integrations: ['upload', 'assetManager', 'url']
                },
            },
            simpleUpload: {
                uploadUrl: '/api/upload-image', // API upload của bạn
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
        }} onChange={function (_, editor) {
            var data = editor.getData();
            setTemplate(data);
        }} onReady={function (editor) { return (editorRef.current = editor); }}/>
          </div>
        </div>
      </div>

      <h2>Kết quả:</h2>
      <div style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginTop: "1rem",
            backgroundColor: "#f9f9f9",
            justifyItems: "center"
        }}>
        <html>
          <body>
            <div ref={targetRef} style={{ textAlign: 'left', background: '#fff', padding: '20px' }} id="pdf-content">
            </div>
          </body>
        </html>
      </div>
      <div ref={previewRef} style={{ display: "none" }}/>
    </div>);
}
exports.default = App;
