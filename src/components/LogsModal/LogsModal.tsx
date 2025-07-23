import React from "react";
import CustomModal from "../customModal/CustomModal";
import { useGetLogsByRow } from "../../api/get/getLogsByRow";
import { formatDisplayDate, formatDisplayTime } from "../../utils/commonFunction";

interface LogsModalProps {
  open: boolean;
  onClose: () => void;
  tableName: string;
  rowId: string | number;
  title?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString();
}

const JsonBlock = ({ data }: { data: any }) => (
  <pre
    style={{
      background: "#23272e",
      color: "#cdd9e5",
      padding: 8,
      borderRadius: 4,
      fontSize: 12,
      overflowX: "auto",
    }}
  >
    {JSON.stringify(data, null, 2)}
  </pre>
);

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

const LogsModal: React.FC<LogsModalProps> = ({
  open,
  onClose,
  tableName,
  rowId,
  title,
}) => {
  const { data, isLoading, isError } = useGetLogsByRow(tableName, rowId);

  return (
    <CustomModal open={open} onClose={onClose} title={title || "Logs"} width='80vh'>
      {isLoading && <div>Loading logs...</div>}
      {isError && <div>Error loading logs.</div>}
      {data && Array.isArray(data) && (
        <div  >
          {data.length === 0 ? (
            <div>No logs found.</div>
          ) : (
            data.map((log: any, idx: number) => (
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
                <div style={{ marginBottom: 8 }}>
                  <ChangedFields changed={log.changed_data} />
                </div>
                {/* <details style={{ marginBottom: 4 }}>
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "#88C0D0",
                    }}
                  >
                    Show Previous Data
                  </summary>
                  <JsonBlock data={log.old_data} />
                </details>
                <details>
                  <summary
                    style={{
                      cursor: "pointer",
                      color: "#A3BE8C",
                    }}
                  >
                    Show Current Data
                  </summary>
                  <JsonBlock data={log.new_data} />
                </details> */}
              </div>
            ))
          )}
        </div>
      )}
    </CustomModal>
  );
};

export default LogsModal;