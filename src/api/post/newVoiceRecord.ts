import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a VoiceRecord using FormData
const createVoiceRecord: MutationFunction<any, { blob: Blob; leadId: number; createdBy: number }> = async ({
  blob,
  leadId,
  createdBy,
}) => {
  const formData = new FormData();
  formData.append("voice", blob); // `voice` should match your backend field name
  formData.append("leadId", leadId.toString());
  formData.append("createdBy", createdBy.toString());

  const response = await axiosInstance.post("/voiceRecord/createVoiceRecord", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useCreateVoiceRecord = () => {
  return useMutation(createVoiceRecord);
};
