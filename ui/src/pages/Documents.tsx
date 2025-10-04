import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DocumentsFilter from "@/components/DocumentsFilter";
import DocumentGrid from "@/components/DocumentGrid";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { documentListRequest, DocumentState } from "@/store/document/slices";
import Loading from "@/components/Loading";

const Documents = () => {
  const navigate = useNavigate();
  const documentState = useSelector(
    (store: { document: DocumentState }) => store.document,
  );
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [documentType, setDocumentType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { isLoading } = documentState;

  // Filter documents based on search term and document type
  const filteredDocuments = documentState.documents.filter((doc) => {
    const matchesSearchTerm =
      !searchTerm || doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = documentType === "all" || doc.type === documentType;
    return matchesSearchTerm && matchesType;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocuments = filteredDocuments.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const resetFilters = () => {
    setSearchTerm("");
    setDocumentType("all");
    setCurrentPage(1);
  };

  const handleUpload = () => {
    navigate("/upload-document");
  };

  useEffect(() => {
    // Fire request all documents
    dispatch(documentListRequest());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">My Documents</h1>
        <Button onClick={handleUpload} className="button-gradient">
          <PlusIcon className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      <Loading isLoading={isLoading}></Loading>
      <DocumentsFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resetFilters={resetFilters}
      />

      <DocumentGrid
        documents={paginatedDocuments}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Documents;
