import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  userCreateRequest,
  userCreateSuccess,
  userCreateFailure,
  CreateUser,
} from "./slices";
import http from "@/shared/api/http";
import { addToast } from "../toast/slices";
import { loginRequest } from "../auth/slices";

function* handleCreateUser() {
  yield takeLatest(
    [userCreateRequest],
    function* (action: PayloadAction<CreateUser>) {
      if (!userCreateRequest.match(action)) {
        return;
      }
      try {
        // Make API call
        const response = yield call(http.post, "/users", {
          ...action.payload,
          image: null,
        });

        if (response.data.data.success) {
          // Handle success
          yield put(userCreateSuccess(response.data.data.user));

          // Force login with that new account
          const { email, password } = action.payload;
          yield put(loginRequest({ email, password }));

          // Force redirect
          window.location.href = "/dashboard";
        }
      } catch (err: any) {
        // Extract error message
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred.";

        // Handle failure
        yield put(userCreateFailure(errorMessage));
        yield put(
          addToast({
            id: Date.now().toString(),
            title: "Error",
            description: errorMessage,
            type: "error",
          }),
        );
      }
    },
  );
}

export default function* userSagas() {
  yield all([handleCreateUser()]);
}
