import { UserOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import CustomModal from "../../../../components/customModal/CustomModal";
import { useGetAllUsers } from "../../../../api/get/getAllMember";
import { useCreateMention } from "../../../../api/post/newMention";
import Select from 'react-select';
import { Button, message } from "antd";
import CustomSelect from "../../../../components/customSelect/CustomSelect";

// Add custom styles for react-select dropdown
const customSelectStyles = {
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: "#181818", // black background
    color: "#fff",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#23272f" : "#181818",
    color: "#fff",
    cursor: "pointer",
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: "#23272f",
    color: "#fff",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: "#fff",
    ':hover': {
      backgroundColor: '#333',
      color: '#fff',
    },
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: "#181818",
    color: "#fff",
    borderColor: "#23272f",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  input: (provided: any) => ({
    ...provided,
    color: "#fff",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#aaa",
  }),
};

interface MentionModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  leadId: number;
  refetch: () => void;
}

const MentionModal: React.FC<MentionModalProps> = ({ open, onClose, title, leadId, refetch }) => {
    const userid = localStorage.getItem("userid");
  const { data: allMembersData } = useGetAllUsers();
  const createMention = useCreateMention();

  // Store userId and name in state
  const [assigneeOptions, setAssigneeOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (allMembersData) {
      setAssigneeOptions(
        allMembersData
          ?.filter((u: any) => u?.name && u?.userId)
          ?.map((u: any) => ({
            label: u?.name,
            value: u?.userId,
          }))
      );
    }
  }, [allMembersData]);

  const handleMention = async () => {
    if (!selectedAssignees.length) {
      message.warning("Please select at least one person to mention.");
      return;
    }
    setLoading(true);
    try {
      // You can loop or send all at once depending on your API
      await Promise.all(
        selectedAssignees.map((assignee) =>
          createMention.mutateAsync([
            {
              leadId,
              userId: assignee.value,
              type: "tag",
              createdBy: userid, // Assuming 1 is the ID of the user creating the mention
              // Add other fields as needed, e.g. message, mentionedBy, etc.
            },
            userid// userId or any other param if needed
          ])
        )
      );
      message.success("Mention(s) created!");
      setSelectedAssignees([]);
      refetch();
      onClose();
    } catch (err) {
      message.error("Failed to create mention.");
    } finally {
      setLoading(false);
    }
  };

  // Filter and highlight
  const filteredOptions = assigneeOptions.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlight = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === term.toLowerCase() ? (
            <span key={i} style={{ background: "#faad14", color: "#222" }}>{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <CustomModal open={open} onClose={onClose} title={title} footer={null}>
      <div style={{ marginBottom: 16 }}>Select one or more people to tag:</div>
      <CustomSelect
        isMulti
        options={filteredOptions}
        value={selectedAssignees}
        onChange={(val) => setSelectedAssignees(val as any)}
        placeholder="Search for a person..."
        menuIsOpen={false}
        inputValue={searchTerm}
        onInputChange={(val: any) => setSearchTerm(val)}
      />
      {/* Remove the separate <input> for search */}
      <div style={{ margin: '12px 0', maxHeight: 200, overflowY: 'auto', background: '#181818', borderRadius: 4, padding: 8 }}>
        {filteredOptions.length === 0 && <div style={{ color: '#888' }}>No assignees found.</div>}
        {filteredOptions.map(opt => (
          <div
            key={opt.value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: '6px 8px',
              margin: '2px 0',
              borderRadius: 4,
              background: selectedAssignees.some(sel => sel.value === opt.value) ? '#23272f' : 'transparent',
              color: '#fff',
              cursor: 'pointer',
              transition: "background 0.2s",
            }}
            onClick={() => {
              // Toggle selection
              if (selectedAssignees.some(sel => sel.value === opt.value)) {
                setSelectedAssignees(selectedAssignees.filter(sel => sel.value !== opt.value));
              } else {
                setSelectedAssignees([...selectedAssignees, opt]);
              }
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#2a2f3a")}
            onMouseOut={e => (e.currentTarget.style.background = selectedAssignees.some(sel => sel.value === opt.value) ? '#23272f' : 'transparent')}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 14,
              color: "#faad14"
            }}>
              {opt.label[0]?.toUpperCase() || <UserOutlined />}
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>{highlight(opt.label, searchTerm)}</div>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="primary"
        style={{ marginTop: 16, width: "100%" }}
        loading={loading}
        onClick={handleMention}
      >
        Mention
      </Button>
    </CustomModal>
  );
};

export default MentionModal;