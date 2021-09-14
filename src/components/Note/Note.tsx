import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faPencilAlt,
  faThumbtack,
} from "@fortawesome/free-solid-svg-icons";
import { FC, FocusEvent, useState } from "react"; // Importing Functional Component and it used to define type
import INote from "../../interfaces/note.interface";
import "./Note.css";

type Props = {
  note: INote;
  onNoteUpdate: (note: INote) => void;
  onNoteDelete: (note: INote) => void;
  toggleHandler: (note: INote) => void;
  isPinned: (note: INote) => void;
  //   onNoteUpdate: Function;
};

const Note: FC<Props> = ({
  note,
  onNoteUpdate,
  onNoteDelete,
  toggleHandler,
  isPinned,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const pinnedNote: INote = {
    ...note,
    pinned: !note.pinned,
  };

  // What the heck was this, it was updating pin whatever I do update it

  // const pinnedNote = (note = {
  //   ...note,
  //   pinned: !note.pinned,
  // });

  const noteTextUpdated = (e: FocusEvent<HTMLDivElement>) => {
    setIsFocused(false);
    // console.log("note text change");
    const newTextValue = e.currentTarget.textContent;
    if (newTextValue === note.text) {
      return;
    }
    const updatedNoteobject: INote = {
      ...note,
      text: newTextValue || "",
    };
    // console.log(e.currentTarget.textContent);
    onNoteUpdate(updatedNoteobject);
  };

  return (
    <div className={isFocused ? "note note--focused" : "note"}>
      <div className="note__tools">
        <a className="link" target="_blank" rel="noreferrer" href={note.link}>
          <FontAwesomeIcon icon={faLink} />
        </a>
        <button
          onClick={() => {
            toggleHandler(note);
          }}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </button>
      </div>
      <button
        onClick={() => {
          isPinned(pinnedNote);
        }}
        className={note.pinned ? "note__pin note__pinned" : "note__pin"}
      >
        <FontAwesomeIcon icon={faThumbtack} />
      </button>
      <button
        onClick={() => {
          onNoteDelete(note);
        }}
        type="button"
        className="btn-close"
        aria-label="Close"
      ></button>
      <div
        onBlur={noteTextUpdated}
        onFocus={() => {
          setIsFocused(true);
        }}
        contentEditable={true}
        suppressContentEditableWarning={true}
        className="note__text"
      >
        {note.text}
      </div>
    </div>
  );
};

export default Note;
