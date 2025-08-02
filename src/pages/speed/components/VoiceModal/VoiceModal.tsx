import React, { useState } from "react";
import { Modal, Button } from "antd";
import { ReactMic } from "react-mic";
import CustomModal from "../../../../components/customModal/CustomModal";
import * as styled from "./style";

interface VoiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (audioBlob: Blob) => void;
}

const VoiceModal: React.FC<VoiceModalProps> = ({ open, onClose, onSave }) => {
  const [record, setRecord] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isStarted, setIsStarted] = useState(false);


  return (
    <CustomModal
      open={open}
      onClose={onClose}
      footer={null}
      title="Record Voice Note"
    >
      <div style={{ textAlign: "center" }}>
        
        <styled.StyledMicWrapper>
          <ReactMic
            record={record}
            className="sound-wave"
            onStop={(recorded) => setAudioBlob(recorded.blob)}
            strokeColor="#000000"
            backgroundColor="#fff"
          />
          </styled.StyledMicWrapper>
        
        <div style={{ marginTop: 16 }}>
          {!isStarted && (
          <Button onClick={() =>{setRecord(true), setIsStarted(true)}} disabled={record}>
            Start
          </Button>


          )}
          {isStarted && (
          <Button onClick={() =>{setIsStarted(false), setRecord(false)}} disabled={!record} style={{ marginLeft: 8 }}>
            Stop
          </Button>

          )}


        </div>
        {audioBlob && (
          <audio controls src={URL.createObjectURL(audioBlob)} style={{ marginTop: 16 }} />
        )}
        <div style={{ marginTop: 16 }}>
          {audioBlob && (  

          <Button
            type="primary"
            onClick={() => audioBlob && onSave(audioBlob)}
            disabled={!audioBlob}
          >
            Save
          </Button>
          )}
          <Button onClick={onClose} style={{ marginLeft: 8 }}>
            Cancel
          </Button>
        </div>
      </div>
    </CustomModal>
  );
};

export default VoiceModal;