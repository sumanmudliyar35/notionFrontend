import React from "react";
import CustomModal from "../customModal/CustomModal";
import { useGetLogsTableAndUser } from "../../api/get/getLogsByTableAndUser";
import { formatDisplayDate } from "../../utils/commonFunction";

interface LogsModalProps {
  open: boolean;
  onClose: () => void;
  tableName: string;
  title?: string;
  userId: number;
}

const ChangedFields = ({ changed }: { changed: any }) => {
  if (!changed || Object.keys(changed).length === 0)
    return <div>No fields changed.</div>;
  return (
    <table style={{ width: "100%", fontSize: 13, marginBottom: 8 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Field</th>
          <th style={{ textAlign: "left" }}>Previous</th>
          <th style={{ textAlign: "left" }}>Current</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(changed).map(([field, val]: any) => (
          <tr key={field}>
            <td style={{ fontWeight: 500 }}>{field}</td>
            <td style={{ color: "#e57373" }}>
              {field === "updatedAt"
                ? formatDisplayDate(val.old)
                : val.old ?? JSON.stringify(val)}
            </td>
            <td style={{ color: "#81c784" }}>
              {field === "updatedAt"
                ? formatDisplayDate(val.new)
                : val.new ?? JSON.stringify(val)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const UsersTableLogs: React.FC<LogsModalProps> = ({
  open,
  onClose,
  tableName,
  title,
  userId
}) => {
  const [offset, setOffset] = React.useState(0);
  const [allLogs, setAllLogs] = React.useState<any[]>([]);

  const { data, isLoading, isError } = useGetLogsTableAndUser(tableName, userId, offset);

  // When new data arrives, append it to allLogs (except on first load)
// React.useEffect(() => {
//   if (data && Array.isArray(data)) {
//     if (offset === 0) {
//       setAllLogs(data);
//     } else if (data.length > 0) {
//       setAllLogs(prev => {
//         // Avoid duplicates by id
//         const existingIds = new Set(prev.map((log: any) => log.id));
//         const newLogs = data.filter((log: any) => !existingIds.has(log.id));
//         return [...prev, ...newLogs];
//       });
//     }
//   }
// }, [data, offset]);

React.useEffect(() => {
  if (data && Array.isArray(data)) {
    const sortByChangedAt = (arr: any[]) =>
      arr.slice().sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime());

    if (offset === 0) {
      setAllLogs(sortByChangedAt(data));
    } else if (data.length > 0) {
      setAllLogs(prev => {
        // Avoid duplicates by id
        const existingIds = new Set(prev.map((log: any) => log.id));
        const newLogs = data.filter((log: any) => !existingIds.has(log.id));
        return sortByChangedAt([...prev, ...newLogs]);
      });
    }
  }
}, [data, offset]);

  const handleLoadMore = () => {
    setOffset(prev => prev + 40);
  };

  return (
    <CustomModal open={open} onClose={onClose} title={title || "Logs"} width='80vh'>
      {isLoading && <div>Loading logs...</div>}
      {isError && <div>Error loading logs.</div>}
      {allLogs && Array.isArray(allLogs) && (
        <div>
          {allLogs.length === 0 ? (
            <div>No logs found.</div>
          ) : (
            <>
              {allLogs.map((log: any, idx: number) => (
                <div
                  key={log.id || idx}
                  style={{
                    marginBottom: 24,
                    borderBottom: "1px solid #333",
                    paddingBottom: 16,
                  }}
                >
                  <div style={{ marginBottom: 4 }}>
                    <strong>{log.operation}</strong> by{" "}
                    <span style={{ color: "#4fa3ff" }}>
                      {log.changedBy ?? "Unknown"}
                    </span>{" "}
                    on{" "}
                    <span style={{ color: "#bdbdbd" }}>
                      {formatDisplayDate(log.changed_at)}
                    </span>
                  </div>
                  <div>
                    {log.name ? log.name : "No Name Provided"}
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <ChangedFields changed={log.changed_data} />
                  </div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  onClick={handleLoadMore}
                  style={{
                    padding: "8px 24px",
                    background: "#23272e",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  Load More
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </CustomModal>
  );
};

export default UsersTableLogs;