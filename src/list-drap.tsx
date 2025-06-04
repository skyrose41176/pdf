import React, { useRef, useEffect } from "react";

// Giả lập các import đặc thù, thay thế bằng import thật khi dùng thực tế
// import { CS_CONFIG, attachTourBalloon } from '@snippets/index.js';
// import { DragDropEditor } from './build-drag-drop-source.js';

interface Contact {
  name: string;
  tel: string;
  email: string;
  avatar: string;
}

const contacts: Contact[] = [
  {
    name: "Huckleberry Finn",
    tel: "+48 1345 234 235",
    email: "h.finn@example.com",
    avatar: "hfin"
  },
  {
    name: "D'Artagnan",
    tel: "+45 2345 234 235",
    email: "dartagnan@example.com",
    avatar: "dartagnan"
  },
  {
    name: "Little Red Riding Hood",
    tel: "+45 2345 234 235",
    email: "lrrh@example.com",
    avatar: "lrrh"
  },
  {
    name: "Alice",
    tel: "+20 4345 234 235",
    email: "alice@example.com",
    avatar: "alice"
  },
  {
    name: "Phileas Fogg",
    tel: "+44 3345 234 235",
    email: "p.fogg@example.com",
    avatar: "pfog"
  },
  {
    name: "Winnetou",
    tel: "+44 3345 234 235",
    email: "winnetou@example.com",
    avatar: "winetou"
  },
  {
    name: "Edmond Dantès",
    tel: "+20 4345 234 235",
    email: "count@example.com",
    avatar: "edantes"
  },
  {
    name: "Robinson Crusoe",
    tel: "+45 2345 234 235",
    email: "r.crusoe@example.com",
    avatar: "rcrusoe"
  }
];

const DragDropDemo: React.FC = () => {
  const contactsRef = useRef<HTMLUListElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Khởi tạo DragDropEditor nếu bạn có sẵn Editor tương ứng
    // DragDropEditor.create(editorRef.current, {
    //   placeholder: 'Drop the content here to test the feature.',
    //   cloudServices: CS_CONFIG
    // })
    // .then(editor => {
    //   window.editor = editor;
    //   attachTourBalloon({ ... })
    // })
    // .catch(err => console.error(err));

    const handleDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement;
      // Đảm bảo target hợp lệ
      if (!target) return;

      const draggable = target.closest("[draggable]");
      if (!draggable) return;

      const dataContact = (draggable as HTMLElement).getAttribute("data-contact");
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
        current.removeEventListener("dragstart", handleDragStart as EventListener);
      }
    };
  }, []);

  return (
    <div className="drag-drop-demo" style={{ display: "flex", gap: 32 }}>
      <ul className="contacts" ref={contactsRef} style={{ listStyle: "none", padding: 0 }}>
        {contacts.map((contact, id) => (
          <li key={id}>
            <div
              className="contact h-card"
              data-contact={id}
              draggable="true"
              style={{ display: "flex", alignItems: "center", marginBottom: 8, cursor: "grab" }}
            >
              <img
                src={`../assets/img/${contact.avatar}.png`}
                alt="avatar"
                className="u-photo"
                draggable="false"
                width={32}
                height={32}
                style={{ marginRight: 8, borderRadius: "50%" }}
              />
              {contact.name}
            </div>
          </li>
        ))}
      </ul>
      <div id="snippet-drag-drop" ref={editorRef} style={{ flex: 1, minHeight: 200, border: "1px solid #ccc" }}>
        {/* Thay thế bằng CKEditor5 React Component nếu cần */}
        {/* <CKEditor ... /> */}
        <p>Điền CKEditor5 component vào đây.</p>
      </div>
    </div>
  );
};

export default DragDropDemo;