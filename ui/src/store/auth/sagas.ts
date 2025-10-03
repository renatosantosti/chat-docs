import { all, call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logoutRequest,
  logoutSuccess,
  checkAuthRequest,
  checkAuthSuccess,
  checkAuthFailure,
} from "./slices";
import http from "@/shared/api/http";

function* handleLogin() {
  yield takeLatest(
    [loginRequest],
    function* (action: PayloadAction<{ email: string; password: string }>) {
      if (!loginRequest.match(action)) {
        return;
      }
      try {
        const res = yield call(http.post, "/auth/login", action.payload);
        yield put(loginSuccess(res.data.user));
      } catch (err) {
        yield put(
          loginFailure("Failed, check your credentials and try it again."),
        );
      }
    },
  );
}

function* handleLogout() {
  yield takeLatest([logoutRequest], function* (action: PayloadAction) {
    if (!logoutRequest.match(action)) {
      return;
    }

    try {
      yield call(http.post, "/auth/logout");
    } catch (err) {
      console.error("Logout error", err);
    }

    yield put(logoutSuccess());
  });
}

function* handleCheckAuth() {
  yield takeLatest([checkAuthRequest], function* (action: PayloadAction) {
    if (!checkAuthRequest.match(action)) {
      return;
    }

    try {
      const res = yield call(http.get, "/auth/check");
      yield put(checkAuthSuccess(res.data.user));
    } catch (err) {
      yield put(checkAuthFailure());
    }
  });
}

export default function* authSagas() {
  yield all([handleLogin(), handleLogout(), handleCheckAuth()]);
}
