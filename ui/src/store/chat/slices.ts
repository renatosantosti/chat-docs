import { PageItem } from "@/shared/models";
import { ChatMode } from "@/shared/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatResult {
  documentId: Number;
  term: string;
  pages: PageItem[];
  response?: string[];
}

export interface ChatRequest {
  documentId: number;
  term: string;
  mode: ChatMode;
}

export interface ChatState {
  results: ChatResult[];
  wasActivated: boolean;
  isLoading: boolean;
  filtered: boolean;
  response?: string;
}

const initialState: ChatState = {
  results: [],
  wasActivated: false,
  isLoading: false,
  filtered: false,
  response: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    chatRequest: (state: ChatState, action: PayloadAction<ChatRequest>) => {
      state.isLoading = true;
      state.wasActivated = true;
      state.filtered = false;
      if (action.payload.mode === "chat") state.response = "thinking...";
    },

    chatRequestSuccess: (
      state: ChatState,
      action: PayloadAction<ChatResult>,
    ) => {
      state.results = [
        ...state.results.filter(
          (r) => r.documentId !== action.payload.documentId,
        ),
        action.payload,
      ];

      state.isLoading = false;
      state.filtered = true;
      if (action.payload.response && action.payload.response.length > 0) {
        state.response = action.payload.response[0];
        return;
      }
      state.response = "";
    },

    chatRequestFailure: (state: ChatState) => {
      state.isLoading = false;
    },

    askQuestion: (state: ChatState) => {
      state.response = "Waiting for questions.";
    },

    clearResult: (state: ChatState) => {
      state.wasActivated = false;
      state.isLoading = false;
      state.filtered = false;
      state.results = [];
    },
  },
});

export const {
  chatRequest,
  chatRequestSuccess,
  chatRequestFailure,
  askQuestion,
  clearResult,
} = chatSlice.actions;

const chatReducer = chatSlice.reducer;
export default chatReducer;
