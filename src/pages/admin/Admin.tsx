import { PlusOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Popconfirm, message } from "antd"
import { useEffect, useState } from "react";
import AddMemberModal from "./components/AddMemberModal/AddMemberModal";
import { useGetAllUsers } from "../../api/get/getAllMember";
import type { ColumnDef } from '@tanstack/react-table'; // assuming you use react-table v8 or similar
import { CustomTable } from "../../components/customTable/CustomTable";
import * as styled from './style';
import { useDeleteUser } from "../../api/delete/deleteUser";
import CustomSwitch from "../../components/customSwitch/CustomSwitch";
import { useUpdateUser } from "../../api/put/updateUser";
import CustomEditableCell from "../../components/CustomEditableCell/CustomEditableCell";
import { usecreateProfilePicture } from "../../api/post/newProfliePicture";

interface User {
  userId: number;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  roleId: number | null;
}

const Admin = () => {
  

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const {data: allMembers, refetch: refetchAllMember} = useGetAllUsers();


  const [tableData, setTableData] = useState<any[]>(allMembers || []);


  useEffect(() => {
    if (allMembers) {
      setTableData(allMembers);
    }
  }, [allMembers]);

  // const handleDelete = (userId: number) => {
  //   const body={
  //     deletedAt: new Date() // Assuming you want to set deletedAt to current time
  //   }
  //   deleteUserMutation.mutate(
  //     [body, userId], // Pass empty body and userId as per your mutation function
  //     {
  //       onSuccess: () => {
  //         message.success(`Deleted user with ID: ${userId}`);
  //         refetchAllMember();
  //       },
  //       onError: () => {
  //         message.error("Failed to delete user.");
  //       },
  //     }
  //   );
  // };


  const updateUserMutate = useUpdateUser();
  const handleToggleShowLead = async(userId: number, checked: boolean) => {

  const response = await updateUserMutate.mutateAsync([{ showLeads: checked }, userId]);



  setTableData(prevData =>
    prevData.map(user => 
      user.userId === userId ? { ...user, showLeads: checked } : user
    )
  );
 

}

const handleToggleShowLogs = async(userId: number, checked: boolean) => {

  const response = await updateUserMutate.mutateAsync([{ showLogs: checked }, userId]);
  setTableData(prevData =>
    prevData.map(user => 
      user.userId === userId ? { ...user, showLogs: checked } : user
    )
  );


}


  const columns = [
  // {
  //   header: 'User ID',
  //   accessorKey: 'userId',
  //   size: 80,
  // },
  {
    header: 'Name',
    accessorKey: 'name',
    size: 200,
    cell: ({ row }: any) => (
      <CustomEditableCell
        value={row.original.name}
        onSave={async (newValue: string) => {
          if (newValue !== row.original.name) {
            await updateUserMutate.mutateAsync([{ name: newValue }, row.original.userId]);
            refetchAllMember();
          }
        }}
        placeholder="Click to edit"
        isCellActive={false}
      />
    ),
    // meta: { editable: true },
  },
  {
    header: 'Email',
    accessorKey: 'email',
    size: 250,
    cell: ({ row }: any) => (

      <CustomEditableCell
        value={row.original.email}
        onSave={async (newValue: any) => {

console.log("New Email:", newValue);

          if (newValue !== row.original.email) {
            await updateUserMutate.mutateAsync([{ email: newValue }, row.original.userId]);
            refetchAllMember();
          }
        }}
        placeholder="Click to edit"
        isCellActive={false}
      />
    ),
    // meta: { editable: true },
  },
  {
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
    size: 150,
    cell: ({ row }: any) => (
      <CustomEditableCell
        value={row.original.phoneNumber}
        onSave={async (newValue: string) => {
          console.log("New Phone Number:", newValue);
          console.log("Original Phone Number:", row.original.phoneNumber);
          if (newValue !== row.original.phoneNumber) {
            await updateUserMutate.mutateAsync([{ phoneNumber: newValue }, row.original.userId]);
            refetchAllMember();
          }
        }}
        placeholder="Click to edit"
        isCellActive={false}
      />
    ),
    // meta: { editable: true },
  },
  {
    header: 'Role ID',
    accessorKey: 'roleId',
    size: 80,
    cell: (info: any) => info.getValue() ?? '-',
    // meta: { editable: true },
  },
  {
    header:"Profile",
    accessorKey: 'profile',
    size: 100,

    cell: ({ row }: any) => {



      const profilePictureMutate = usecreateProfilePicture();
         const handleUpload = async (file: File, userId: any) => {


                                
                                
                                try {
                                  const formData = new FormData();
                                  formData.append("file", file);
                                  formData.append("userId", userId);
                                  formData.append("logId", userId);
                                  
                                 console.log("Uploading file:", file.name, "for user ID:", userId);
                                  
                                
            
                                  const response = await profilePictureMutate.mutateAsync([formData, userId]);

      
                                  // const attachmentResponse = await postGetTaskAttachmentMutate.mutateAsync([row.original.id]);
                                  // setTableData(prev =>
                                  //   prev.map(item => item.id === row.original.id ? { ...item, files: attachmentResponse } : item)
                                  // );
      
                                  // refetchTasksData();
                                  
                                  
                                } catch (error) {
                                  console.error("Error uploading file:", error);
                                 
                                }
                              };

       const triggerFileUpload = (e: React.MouseEvent) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Create a new file input element dynamically
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.onchange = (e) => {
                                  const files = (e.target as HTMLInputElement).files;
                                  if (files && files.length > 0) {
                                    handleUpload(files[0], row.original.userId);
                                  }
                                };
                                // Trigger click on the input
                                input.click();
                              };
       return (
                <div>

                   <Button
                onClick={triggerFileUpload}
                                  icon={<UploadOutlined />}
                                   style={{ 
                    background: 'white', 
                    border: 'none', 
                    cursor:  'pointer',
                    opacity:  1,
                    height: 24,
                    width: 24,
                  }}

              >
              </Button>




                </div>
                        )


                      },

  },
  {
    header: 'Actions',
    accessorKey: 'actions',
    size: 100,
    cell: ({ row }: any) => (
      <Popconfirm
        title="Are you sure to delete this user?"
        onConfirm={() => handleDelete(row.original.userId)}
        okText="Yes"
        cancelText="No"
      >
        <Button danger size="small" icon={<DeleteOutlined />} />
      </Popconfirm>
    ),
    meta: { editable: false },
  },
  {
    header: 'Show Lead',
    accessorKey: 'showLead',
    size: 120,
    cell: ({ row }: any) => (
      <CustomSwitch
        enabled={!!row.original.showLeads}
        onChange={checked => handleToggleShowLead(row.original.userId, checked)}
      />
    ),
    meta: { editable: false },
  },
  {
    header: 'Show Logs',
    accessorKey: 'showLogs',
    size: 120,
    cell: ({ row }: any) => (
      <CustomSwitch
        enabled={!!row.original.showLogs}
        onChange={checked => handleToggleShowLogs(row.original.userId, checked)}
      />
    ),
    meta: { editable: false },
  },
];


  const deleteUserMutation = useDeleteUser();


const handleDelete = async(selectedRows: any[]) => {

  console.log("Selected Rows for Deletion:", selectedRows);

  const userIdsToDelete = selectedRows.map(row => row.original.userId);

  for (const userId of userIdsToDelete) {
    try {
      await deleteUserMutation.mutateAsync([{deletedAt: new Date()}, userId]); // Pass empty body and userId
      message.success(`Deleted user with ID: ${userId}`);
    } catch (error) {
      message.error(`Failed to delete user with ID: ${userId}`);
    }
  }



}

  

  return (
    <styled.mainPageContainer>

         <styled.AddMemberButton
          size="small"
          type="primary"
          icon={<PlusOutlined />}
          onClick={()=>setIsAddMemberModalOpen(true)}
          style={{width:"fitContent"}}
          
          >
            Add member
          </styled.AddMemberButton>


            <CustomTable
                   data={tableData || []}
                    // onDataChange={setTableData}
                    columns={columns}
                    isWithNewRow={false}
                    onDataChange={() => {}}
                    createEmptyRow={() => ({ id: Date.now() })}
                    isDownloadable={false}
                    onSelectionChange={handleDelete}
            


                    />
          

          {isAddMemberModalOpen && (
            <AddMemberModal
            open={isAddMemberModalOpen}
            onClose={()=>setIsAddMemberModalOpen(false)}
            title="Add Member"
            refetch={refetchAllMember}
            />

          )}
        



    </styled.mainPageContainer>
  )
}

export default Admin;