import React from 'react'
import CustomModal from '../../../../components/customModal/CustomModal';
import { useGetLeadByFollowup } from '../../../../api/get/getLeadByFollowup';
import { formatDisplayDate, formatDisplayTime } from '../../../../utils/commonFunction';

const FollowupModal = ({ open, onClose, width }: { open: boolean; onClose: () => void; width: any }) => {
  const { data: followupData, isLoading } = useGetLeadByFollowup();

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      footer={null}
      title="Today's Followups"
        width={width}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          <table style={{ width: '100%', color: '#fff', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #444', padding: 8, textAlign: 'left' }}>Name</th>
                <th style={{ borderBottom: '1px solid #444', padding: 8, textAlign: 'left' }}>Contact</th>
                <th style={{ borderBottom: '1px solid #444', padding: 8, textAlign: 'left' }}>Lead</th>
                <th style={{ borderBottom: '1px solid #444', padding: 8, textAlign: 'left' }}>Followup</th>
                <th style={{ borderBottom: '1px solid #444', padding: 8, textAlign: 'left' }}>Followup Time</th>
              </tr>
            </thead>
            <tbody>
              {followupData?.rows
                ?.slice() // create a shallow copy to avoid mutating original data
                .sort((a: any, b: any) => {
                  // Compare as time strings (e.g. "17:10:00")
                  if (!a.followupTime) return 1;
                  if (!b.followupTime) return -1;
                  return a.followupTime.localeCompare(b.followupTime);
                })
                .map((row: any) => (
                  <tr key={row.id}>
                    <td style={{ borderBottom: '1px solid #333', padding: 8 }}>{row.name}</td>
                    <td style={{ borderBottom: '1px solid #333', padding: 8 }}>{row.contact}</td>
                    <td style={{ borderBottom: '1px solid #333', padding: 8 }}>{row.leads}</td>
                    <td style={{ borderBottom: '1px solid #333', padding: 8 }}>{formatDisplayDate(row.followup)}</td>
                    <td style={{ borderBottom: '1px solid #333', padding: 8 }}>{formatDisplayTime(row.followupTime)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {(!followupData?.rows || followupData.rows.length === 0) && (
            <div style={{ color: '#aaa', padding: 16, textAlign: 'center' }}>No followups found.</div>
          )}
        </div>
      )}
    </CustomModal>
  )
}

export default FollowupModal