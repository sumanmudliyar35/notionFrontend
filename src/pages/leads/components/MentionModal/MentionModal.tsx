import React, { useEffect, useState } from "react";
import CustomModal from "../../../../components/customModal/CustomModal";
import { useGetAllUsers } from "../../../../api/get/getAllMember";
import { useCreateMention } from "../../../../api/post/newMention";
import Select from 'react-select';
import { Button, message } from "antd";

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

  useEffect(() => {
    if (allMembersData) {
      setAssigneeOptions(
        allMembersData
          .filter((u: any) => u.name && u.userId)
          .map((u: any) => ({
            label: u.name,
            value: u.userId,
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
              createdBy: userid, // Assuming 1 is the ID of the user creating the mention
              // Add other fields as needed, e.g. message, mentionedBy, etc.
            },
            1 // userId or any other param if needed
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

  return (
    <CustomModal open={open} onClose={onClose} title={title} footer={null}>
      <div style={{ marginBottom: 16 }}>Select one or more people to mention:</div>
      <Select
        isMulti
        options={assigneeOptions}
        value={selectedAssignees}
        onChange={(val) => setSelectedAssignees(val as any)}
        placeholder="Search for a person..."
        styles={customSelectStyles}
      />
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