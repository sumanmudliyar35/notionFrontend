import { PlusOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useState } from "react";
import AddMemberModal from "./components/AddMemberModal/AddMemberModal";
import { useGetAllUsers } from "../../api/get/getAllMember";
import type { ColumnDef } from '@tanstack/react-table'; // assuming you use react-table v8 or similar
import { CustomTable } from "../../components/customTable/CustomTable";
import * as styled from './style';

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

  const columns: ColumnDef<User>[] = [
  // {
  //   header: 'User ID',
  //   accessorKey: 'userId',
  //   size: 80,
  // },
  {
    header: 'Name',
    accessorKey: 'name',
    size: 200,
    cell: info => info.getValue() ?? '-',
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
    cell: info => info.getValue() ?? '-',
    meta: { editable: true },
  },
  {
    header: 'Role ID',
    accessorKey: 'roleId',
    size: 80,
    cell: info => info.getValue() ?? '-',
    meta: { editable: true },
  },
  // {
  //   header: 'Created At',
  //   accessorKey: 'createdAt',
  //   size: 180,
  //   cell: info => new Date(info.getValue() as string).toLocaleString(),
  // },
  // {
  //   header: 'Updated At',
  //   accessorKey: 'updatedAt',
  //   size: 180,
  //   cell: info => new Date(info.getValue() as string).toLocaleString(),
  // },
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
                   data={allMembers || []}
                    // onDataChange={setTableData}
                    columns={columns}
                    isWithNewRow={false}

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

export default Admin