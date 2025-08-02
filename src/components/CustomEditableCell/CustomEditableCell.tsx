import React, { useRef, useState, useEffect, use } from "react";

interface CustomEditableCellProps {
  value: string;
  onSave: (val: string) => void;
  placeholder?: string;
  options?: any[]; // for dropdown, if needed
  isCellActive?: boolean; // to control if the cell is active or not
  showEditButton?: boolean; // to control if the edit button should be shown
  opnenEditModal?: () => void; // function to open edit modal if needed
}

const CustomEditableCell: React.FC<CustomEditableCellProps> = ({
  value,
  onSave,
  placeholder = "Click to edit",
  options = [],
  isCellActive = false, // default to true if not provided
  showEditButton = false, // default to false if not provided
  opnenEditModal = () => {}, // default to empty function if not provided

}) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isCellActive) {
      setIsEditing(true);
    }
  }, [isCellActive]);



  const [inputValue, setInputValue] = useState(value || "");


  useEffect(() => {
    setInputValue(value || "");
  }, [value]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic height for textarea
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [inputValue, isEditing]);

   useEffect(() => {
          if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
          }
        }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    onSave(inputValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSave(inputValue);
      setIsEditing(false);
    }
  };

  useEffect(() => {
  if (isEditing && inputRef.current) {
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    // Move cursor to end
    const len = inputRef.current.value.length;
    inputRef.current.setSelectionRange(len, len);
    inputRef.current.focus();
  }
}, [isEditing]);

  return (
    <div style={{ minHeight: 24, position: "relative" }}>
      {isEditing ? (
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: "100%",
            background: "#202020",
            color: "white",
            minHeight: 40,
            maxHeight: "35vh", // limit height to 60% of viewport

            fontSize: 14,
            resize: "none",
            borderColor: "#1890ff",
            outline: "1px solid #1890ff", // blue outline

            fontFamily: "sans-serif",
            overflow: "auto",
            borderRadius: 4,
            lineHeight: 1.5,
    outlineOffset: "0px",
          }}
        />
      ) : value ? (
        <span
          style={{
            whiteSpace: "pre-wrap", // preserves both spaces and all line breaks
            cursor: "pointer",
                wordBreak: "break-word", // add this line

            
            display: "block",
          }}
          onClick={e => {
            if ((e.target as HTMLElement).tagName !== "A") setIsEditing(true);
          }}
         dangerouslySetInnerHTML={{
    __html: (value || placeholder || "")
      .replace(/ /g, "&nbsp;")
            .replace(/\n/g, "<br>") // <-- Add this to handle line breaks

      .replace(
        /((https?:\/\/|www\.)[^\s]+)/g,
        (url: any) => {
          const href = url.startsWith("http") ? url : `https://${url}`;
          return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#4fa3ff;text-decoration:underline;">${url}</a>`;
        }
      ),
  }}

        />
      ) : (
        <span
          style={{
    whiteSpace: "pre-wrap", // preserves both spaces and all line breaks
            cursor: "pointer",
            display: "block",
            color: "#888",
          }}
          onClick={() => setIsEditing(true)}
        >
          {placeholder}
        </span>
      )}


      {/* {showEditButton && !isEditing && (
        <button
          onClick={opnenEditModal}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "transparent",
            border: "none",
            color: "#1890ff",
            cursor: "pointer",
            padding: 4,
          }}
        >
          Edit
        </button>
      )} */}



    </div>
  );
};

export default CustomEditableCell;