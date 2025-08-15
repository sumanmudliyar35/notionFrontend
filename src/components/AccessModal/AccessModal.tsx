import React, { useState, useEffect } from "react";
import CustomModal from "../customModal/CustomModal";
import TagSelector from "../customSelectModal/CustomSelectModal";
import { Button, Checkbox } from "antd";
import { useGetAllUsers } from "../../api/get/getAllMember";
import { useCreateUserAccess } from "../../api/post/newUserAccess";
import CustomSelect from "../customSelect/CustomSelect";
import { useGetAccessByOwner } from "../../api/get/getAccessOfUser";
import { DeleteOutlined } from "@ant-design/icons"; // Add this import at the top
import * as styled from './style'
import { useUpdateUserAccess } from "../../api/put/updateUserAccess";

interface AccessModalProps {
    accessorId: any;
  open: boolean;
  onClose: () => void;
 
}

const AccessModal: React.FC<AccessModalProps> = ({
  open,
  onClose,
  accessorId
}) => {
  const { data: allMembersData } = useGetAllUsers();

  const {data: allAccessorData, refetch: refetchAccessors} = useGetAccessByOwner(accessorId);
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
        accessType: readChecked? "read" : "edit",
        ownerId: accessorId,
        createdBy: userId,

    };


    const response = await usersAccessMutate.mutateAsync([body, userId]);
    refetchAccessors();
    onClose();

    
  };

  const updateMutate = useUpdateUserAccess();

  const handleUpdate = async (accessId: string | number) => {
    const body = {
     
      deletedAt: new Date(),
    };

    await updateMutate.mutateAsync([body, accessId]);
    refetchAccessors();
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Set Permissions"
      footer={null}
      width={400}
    >

      <styled.mainContainer>

      
      <div style={{ marginBottom: 16 }}>
        <TagSelector
  options={assigneeOptions}
  value={selectedUsers ?? null}
  onChange={(id) => setSelectedUsers(id !== undefined && id !== null ? id : undefined)}
  allowCreate={false}
  placeholder="Select users..."
  horizontalOptions={false}
  isWithDot={false}
/>
      </div>

      {/* Show current accessors */}
     

      <div style={{ display: "flex", gap: 16, marginBottom: 16, color: "white" }}>
        <Checkbox checked={readChecked} style={{ color: "white" }} onChange={e => {setReadChecked(e.target.checked); setModifyChecked(false);}}>
          Read
        </Checkbox>
        <Checkbox checked={modifyChecked} style={{ color: "white" }} onChange={e => {setModifyChecked(e.target.checked); setReadChecked(false);}}>
          Modify
        </Checkbox>
      </div>
      <div style={{ textAlign: "right" }}>
        <Button type="primary" onClick={handleSave} style={{ marginRight: 8 }}>
          Save
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </div>


       {Array.isArray(allAccessorData) && allAccessorData.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {allAccessorData.map((item: any) => (
            <div
              key={item.id || `${item.accessorId}-${item.ownerId}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#23272e",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <span>
                <b>{item.name}</b> &nbsp; <span style={{ color: "#81c784" }}>{item.accessType== "edit" ? "Modify": "Read"}</span>
              </span>
              <DeleteOutlined
                style={{ color: "#e57373", cursor: "pointer", fontSize: 18 }}
                onClick={() => handleUpdate(item.id)}
              />
            </div>
          ))}
        </div>
      )}

      </styled.mainContainer>
    </CustomModal>
  );
};

export default AccessModal;