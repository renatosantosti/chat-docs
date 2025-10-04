import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  documentListRequest,
  documentListSuccess,
  documentListFailure,
  documentSearchRequest,
  documentSearchSuccess,
  documentSearchFailure,
  documentDeletionRequest,
  documentDeletionSuccess,
  documentDeletionFailure,
} from "./slices";
import http from "@/shared/api/http";
import { DocumentItem } from "@/shared/models";
import { addToast } from "../toast/slices";

function* handleDocumentList() {
  yield takeLatest([documentListRequest], function* (action: PayloadAction) {
    if (!documentListRequest.match(action)) {
      return;
    }

    try {
      const res = yield call(http.get, "/documents");
      console.log("Document list response:", res);
      console.log("Document list response data:", res.data);
      console.log("Document list response data.data:", res.data.data);

      // A resposta tem estrutura: res.data = {description, statusCode, data: {success, message, documents}}
      if (res.data.statusCode !== 200 || !res.data.data.success) {
        yield put(documentListFailure());
        return;
      }

      const docs: DocumentItem[] = res.data.data.documents.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        date: doc.createdOn,
        pages: doc.numPages,
        type: "PDF",
      }));

      console.log(
        "Loaded documents:",
        docs.map((d) => ({ id: d.id, title: d.title })),
      );

      // force loading at least 1,5 seconds
      yield delay(700);
      yield put(documentListSuccess(docs));
    } catch (err) {
      // Extract detailed error message from HTTP response
      const errorMessage =
        err.response?.data?.data?.message ||
        err.message ||
        "An unexpected error occurred.";

      console.error("HTTP Error:", err);
      yield put(
        addToast({
          id: Date.now().toString(),
          title: "Error",
          description: errorMessage,
          type: "error",
        }),
      );
      yield put(documentListFailure());
    }
  });
}

function* handleDocumentSearch() {
  yield takeLatest(
    [documentSearchRequest],
    function* (action: PayloadAction<string>) {
      if (!documentSearchRequest.match(action)) {
        return;
      }
      try {
        const res = yield call(
          http.get,
          `/documents/search?term=${action.payload}`,
        );
        console.log("Search response:", res);
        console.log("Search response data:", res.data);

        yield put(
          documentSearchSuccess({
            term: action.payload,
            documents: res.data.data || res.data,
          }),
        );
      } catch (err) {
        // Extract detailed error message from HTTP response
        const errorMessage =
          err.response?.data?.data?.message ||
          err.message ||
          "An unexpected error occurred.";

        console.error("HTTP Error:", err);
        yield put(
          addToast({
            id: Date.now().toString(),
            title: "Error",
            description: errorMessage,
            type: "error",
          }),
        );
        yield put(documentSearchFailure());
      }
    },
  );
}

function* handleDeletionDocument() {
  yield takeLatest(
    [documentDeletionRequest],
    function* (action: PayloadAction<number>) {
      if (!documentDeletionRequest.match(action)) {
        return;
      }
      try {
        console.log("Attempting to delete document with ID:", action.payload);
        const res = yield call(http.delete, `/documents/${action.payload}`);
        console.log("Delete response:", res);
        console.log("Delete response data:", res.data);
        console.log("Delete response statusCode:", res.data.statusCode);

        // A resposta tem estrutura: res.data = {description, statusCode, data: {success, message}}
        if (res.data.statusCode !== 200 || !res.data.data.success) {
          yield put(
            addToast({
              id: Date.now().toString(),
              title: "Error",
              description: "Failed to delete document. Please try again.",
              type: "error",
            }),
          );
          yield put(documentDeletionFailure());
          return;
        }

        yield put(
          addToast({
            id: Date.now().toString(),
            title: "Success",
            description: "Document deleted successfully.",
            type: "success",
          }),
        );
        yield put(documentDeletionSuccess(action.payload));
      } catch (err) {
        // Extract detailed error message from HTTP response
        const errorMessage =
          err.response?.data?.data?.message ||
          err.message ||
          "Failed to delete document. Please try again.";

        console.error("Delete Document Error:", err);
        yield put(
          addToast({
            id: Date.now().toString(),
            title: "Error",
            description: errorMessage,
            type: "error",
          }),
        );
        yield put(documentDeletionFailure());
      }
    },
  );
}

export default function* documentSagas() {
  yield all([
    handleDocumentList(),
    handleDocumentSearch(),
    handleDeletionDocument(),
  ]);
}
