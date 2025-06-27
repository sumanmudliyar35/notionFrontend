import { useMutation } from "react-query";
import axiosInstance from "../../connection/axiosInstance";
import type { MutationFunction } from "react-query";

// Mutation function to create a VoiceRecord using FormData
const createTaskVoiceRecord: MutationFunction<any, { blob: Blob; taskId: number; createdBy: number }> = async ({
  blob,
  taskId,
  createdBy,
}) => {
  const formData = new FormData();
  formData.append("voice", blob); // `voice` should match your backend field name
  formData.append("taskId", taskId.toString());
  formData.append("createdBy", createdBy.toString());

  const response = await axiosInstance.post("/voiceRecord/createTaskVoiceRecord", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const useCreateTaskVoiceRecord = () => {
  return useMutation(createTaskVoiceRecord);
};
