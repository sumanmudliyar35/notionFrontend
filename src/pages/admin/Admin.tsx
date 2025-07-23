import { PlusOutlined, DeleteOutlined } from "@ant-design/icons"
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
  const deleteUserMutation = useDeleteUser();

  const handleDelete = (userId: number) => {
    const body={
      deletedAt: new Date() // Assuming you want to set deletedAt to current time
    }
    deleteUserMutation.mutate(
      [body, userId], // Pass empty body and userId as per your mutation function
      {
        onSuccess: () => {
          message.success(`Deleted user with ID: ${userId}`);
          refetchAllMember();
        },
        onError: () => {
          message.error("Failed to delete user.");
        },
      }
    );
  };


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
    cell: (info: any) => info.getValue() ?? '-',
    meta: { editable: true },
  },
  {
    header: 'Email',
    accessorKey: 'email',
    size: 250,
    meta: { editable: true },
  },
  {
    header: 'Phone Number',
    accessorKey: 'phoneNumber',
    size: 150,
    cell: (info: any) => info.getValue() ?? '-',
    meta: { editable: true },
  },
  {
    header: 'Role ID',
    accessorKey: 'roleId',
    size: 80,
    cell: (info: any) => info.getValue() ?? '-',
    meta: { editable: true },
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
        // checkedChildren="Show"
        // unCheckedChildren="Hide"
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
        // checkedChildren="Show"
        // unCheckedChildren="Hide"
      />
    ),
    meta: { editable: false },
  },
];

  

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