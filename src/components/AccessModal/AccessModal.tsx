import React, { useState, useEffect } from "react";
import CustomModal from "../customModal/CustomModal";
import TagSelector from "../customSelectModal/CustomSelectModal";
import { Checkbox } from "antd";
import { useGetAllUsers } from "../../api/get/getAllMember";
import { useCreateUserAccess } from "../../api/post/newUserAccess";
import CustomSelect from "../customSelect/CustomSelect";

interface AccessModalProps {
    accessorId?: string | number;
  open: boolean;
  onClose: () => void;
 
}

const AccessModal: React.FC<AccessModalProps> = ({
  open,
  onClose,
  accessorId
}) => {
  const { data: allMembersData } = useGetAllUsers();
  const userId = Number(localStorage.getItem('userid'));
  const [assigneeOptions, setAssigneeOptions] = useState<
    { id: string | number; label: string; value: any }[]
  >([]);
  const [selectedUsers, setSelectedUsers] = useState<string | number | undefined>();
  const [readChecked, setReadChecked] = useState<boolean>();
  const [modifyChecked, setModifyChecked] = useState<boolean>();

  useEffect(() => {
    if (allMembersData) {
      setAssigneeOptions(
        allMembersData
          .filter((u: any) => u.name && u.userId)
          .map((u: any) => ({
            id: u.userId,
            label: u.name,
            value: u.userId,
          }))
      );
    }
  }, [allMembersData]);


  const usersAccessMutate = useCreateUserAccess();


  const handleSave = async() => {
    // onSave(selectedUsers, readChecked, modifyChecked);

    const body={
        accessorId: selectedUsers,
        accessType: readChecked? "read" : "modify",
        ownerId: accessorId,
        createdBy: userId,

    };

    const response = await usersAccessMutate.mutateAsync([body, userId]);

    
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Set Permissions"
      footer={null}
      width={400}
    >
      <div style={{ marginBottom: 16 }}>
       

        <CustomSelect
          options={assigneeOptions}
          value={selectedUsers}
          onChange={(value) => setSelectedUsers(value !== undefined && value !== null ? value : undefined)}
          allowCreate={false}
          placeholder="Select users..."
        />
      </div>
 <div style={{ display: "flex", gap: 16, marginBottom: 16, color: "white" }}>
        <Checkbox checked={readChecked} style={{ color: "white" }} onChange={e => setReadChecked(e.target.checked)}>
          Read
        </Checkbox>
        <Checkbox checked={modifyChecked} style={{ color: "white" }} onChange={e => setModifyChecked(e.target.checked)}>
          Modify
        </Checkbox>
      </div>
      <div style={{ textAlign: "right" }}>
        <button onClick={handleSave} style={{ marginRight: 8 }}>
          Save
        </button>
        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </CustomModal>
  );
};

export default AccessModal;