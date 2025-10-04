import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import {
  Search as SearchIcon,
  SmartToy as BotIcon,
  Visibility as EyeIcon,
  Delete as Trash2,
  Edit as Edit2,
  Chat as BotMessageSquare,
  FindInPage as SearchPageIcon,
} from "@mui/icons-material";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { PageItem } from "@/shared/models";
import { useNavigate } from "react-router-dom";
import { clearSearch, searchRequest, SearchState } from "@/store/search/slices";
import Loading from "@/components/Loading";
import muiTheme from "@/theme/muiTheme";

interface DocumentSearchProps {}

const DocumentSearch: React.FC<DocumentSearchProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((store: { search: SearchState }) => store.search);
  const [searchTerm, setSearchTerm] = useState(state.term);
  const { toast } = useToast();

  const pages: PageItem[] = state.result ? state.result.pages : [];

  const notImplemented = () => {
    alert(
      "It was not integrated on UI yet, please see it working REST API on Swagger.",
    );
  };

  const { isFiltered, isLoading } = state;

  const handleSearch = () => {
    dispatch(searchRequest({ term: searchTerm, mode: "documents" }));
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(clearSearch());
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: "#1f2937",
                fontSize: "2rem",
              }}
            >
              Search Across All Documents
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#6b7280",
                fontWeight: 400,
                maxWidth: 600,
                margin: "0 auto",
                mb: 4,
              }}
            >
              Find content across your entire document collection with
              AI-powered search
            </Typography>
          </Box>

          {/* Search Interface */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <Stack spacing={3}>
              {/* Search Input */}
              <TextField
                fullWidth
                placeholder="Type term to search across all documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "#ffffff",
                    fontSize: "1.1rem",
                    py: 1,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9333ea",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9333ea",
                      borderWidth: 2,
                    },
                  },
                }}
              />

              {/* Search Button */}
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  startIcon={<SearchIcon />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                    },
                    px: 5,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  Search All Documents
                </Button>
              </Box>
            </Stack>
          </Paper>

          {/* Results Summary */}
          {isFiltered && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 4,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                useFlexGap
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    icon={<SearchPageIcon />}
                    label={`${pages.length || 0} page${pages.length !== 1 ? "s" : ""} found`}
                    sx={{
                      backgroundColor: "#f0f9ff",
                      color: "#0284c7",
                      border: "1px solid #bae6fd",
                      fontWeight: 500,
                    }}
                  />
                  {state.term && (
                    <Chip
                      label={`Matching: "${state.term}"`}
                      size="small"
                      sx={{
                        backgroundColor: "#f0fdf4",
                        color: "#16a34a",
                        border: "1px solid #bbf7d0",
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Stack>
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
                  sx={{
                    borderColor: "#ef4444",
                    color: "#ef4444",
                    "&:hover": {
                      borderColor: "#dc2626",
                      backgroundColor: "#fef2f2",
                    },
                    fontSize: "0.9rem",
                  }}
                >
                  Clear Search
                </Button>
              </Stack>
            </Paper>
          )}

          <Loading isLoading={isLoading}></Loading>

          {/* Results Table */}
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              maxWidth: "1200px",
              margin: "0 auto",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f9fafb" }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: "0.9rem",
                      width: "80px",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: "0.9rem",
                      width: "200px",
                    }}
                  >
                    Document
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: "0.9rem",
                      width: "80px",
                    }}
                  >
                    Page
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: "0.9rem",
                    }}
                  >
                    Content
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      fontSize: "0.9rem",
                      width: "140px",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages && pages.length > 0 ? (
                  pages.map((doc: PageItem, index) => (
                    <TableRow
                      key={`${doc.documentId}-${doc.pageNumber}-${index}`}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f9fafb",
                        },
                        "&:last-child td": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#6b7280",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                        }}
                      >
                        {doc.documentId}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#1f2937",
                          fontSize: "0.9rem",
                          fontWeight: 500,
                        }}
                      >
                        {doc.documentName}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`Page ${doc.pageNumber}`}
                          size="small"
                          sx={{
                            backgroundColor: "#f3e8ff",
                            color: "#9333ea",
                            fontWeight: 500,
                            fontSize: "0.75rem",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            maxHeight: "100px",
                            overflow: "hidden",
                            backgroundColor: "#f9fafb",
                            p: 1.5,
                            borderRadius: 1.5,
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#4b5563",
                              lineHeight: 1.4,
                              fontSize: "0.85rem",
                            }}
                          >
                            <Highlighter
                              highlightClassName="bg-yellow-200"
                              searchWords={[...searchTerm.split(" ")]}
                              autoEscape={true}
                              textToHighlight={doc.content}
                            />
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<BotIcon />}
                            onClick={() =>
                              navigate(`/chatdoc/${doc.documentId}`)
                            }
                            sx={{
                              background:
                                "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                              },
                              fontSize: "0.75rem",
                              py: 0.5,
                              px: 1.5,
                              borderRadius: 1.5,
                              fontWeight: 500,
                            }}
                          >
                            Chat
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => notImplemented()}
                            sx={{
                              borderColor: "#e5e7eb",
                              color: "#6b7280",
                              minWidth: "32px",
                              height: "28px",
                              "&:hover": {
                                borderColor: "#9333ea",
                                backgroundColor: "#f3e8ff",
                                color: "#9333ea",
                              },
                            }}
                          >
                            <EyeIcon sx={{ fontSize: 16 }} />
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      sx={{
                        textAlign: "center",
                        py: 6,
                        color: "#6b7280",
                      }}
                    >
                      <Stack spacing={2} alignItems="center">
                        <SearchPageIcon
                          sx={{ fontSize: 48, color: "#9ca3af" }}
                        />
                        <Typography variant="h6" sx={{ color: "#6b7280" }}>
                          No documents found
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                          Try adjusting your search terms or upload more
                          documents.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DocumentSearch;
