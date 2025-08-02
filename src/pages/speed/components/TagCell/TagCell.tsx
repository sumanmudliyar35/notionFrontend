import React from "react";
import TagMultiSelector from "../../../../components/CustomMultiSelectModal/CustomMultiSelectModal";
import CustomTag from "../../../../components/customTag/CustomTag";

const TagCell = ({
  mentions,
  assigneeOptions,
  rowId,
  userid,
  createMention,
  setTableData,
  handleRemoveTags,
  handleAddTags,

}: {
  mentions: any;
  assigneeOptions: any[];
  rowId: any;
  userid: any;
  createMention: any;
  setTableData: any;
  handleRemoveTags: (userId: any, rowId: any) => void;
  handleAddTags?: (userId: any, rowId: any) => void;
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = React.useState(false);
  const cellRef = React.useRef<HTMLDivElement>(null);

  // Ensure mentions is always an array
  let parsedMentions = mentions;
  if (!Array.isArray(parsedMentions)) {
    try {
      parsedMentions =
        parsedMentions && typeof parsedMentions === "string"
          ? JSON.parse(parsedMentions)
          : [];
    } catch {
      parsedMentions = [];
    }
  }

  React.useEffect(() => {
    if (!isSelectorOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isSelectorOpen]);

  const handletags = async (selectedValues: (string | number)[]) => {
    const selectedTags = assigneeOptions
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => ({ userId: opt.value, userName: opt.label }));

      handleAddTags?.(selectedTags, rowId);

    // await Promise.all(
    //   selectedTags.map((tag: any) =>
    //     createMention.mutateAsync([
    //       {
    //         leadId: rowId,
    //         userId: tag.userId,
    //         type: "tag",
    //         createdBy: userid,
    //       },
    //       userid,
    //     ])
    //   )
    // );

   
  };

  return (
    <div
      ref={cellRef}
      style={{
        cursor: "pointer",
        color: "#52c41a",
        minHeight: 32,
        display: "flex",
        alignItems: "center",
        gap: 4,
        flexWrap: "wrap",
      }}
      onClick={() => setIsSelectorOpen(true)}
    >
      {isSelectorOpen ? (
        <TagMultiSelector
          options={assigneeOptions}
          value={Array.isArray(parsedMentions) ? parsedMentions.map((m: any) => m.userId) : []}
          onChange={(val) =>
            handletags(Array.isArray(val) ? val : val == null ? [] : [val])
          }
          allowCreate={false}
          horizontalOptions={false}
          isMulti={true}
          isWithDot={false}
          placeholder="Add tag"
        />
      ) : Array.isArray(parsedMentions) && parsedMentions.length > 0 ? (
        parsedMentions.map((m: any) => (
          <CustomTag
            key={m.userId}
            name={m.userName}
            onClose={() => {
              handleRemoveTags(m.userId, rowId);
            }}
          />
        ))
      ) : (
        <span style={{ color: "#aaa" }}>Tag</span>
      )}
    </div>
  );
};

export default TagCell;