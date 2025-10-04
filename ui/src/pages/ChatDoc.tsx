import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  IconButton,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputAdornment,
  Divider,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import {
  Search as SearchIcon,
  Download as DownloadIcon,
  SmartToy as BotIcon,
  Chat as ChatIcon,
  FindInPage as SearchPageIcon,
} from "@mui/icons-material";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import {
  askQuestion,
  chatRequest,
  clearResult,
  ChatState,
} from "@/store/chat/slices";
import { ChatMode } from "@/shared/types";
import { DocumentState } from "@/store/document/slices";
import { AuthState } from "@/store/auth/slices";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "@/components/Loading";
import MarkdownTypewriterNoCursor from "@/components/MarkdownTypewriterNoCursor";
import muiTheme from "@/theme/muiTheme";

const ChatDoc = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((store: { chat: ChatState }) => store.chat);
  const docState = useSelector(
    (store: { document: DocumentState }) => store.document,
  );
  const authState = useSelector((store: { auth: AuthState }) => store.auth);
  const { id } = useParams<{ id: string }>();
  const { isLoading, filtered, response } = state;
  const limitText = 1130;
  const documentId = parseInt(id || "0");

  const [pages, setPages] = useState([]);
  const [priviousTerm, setPriviousTerm] = useState("");
  const [mode, setMode] = useState<ChatMode>("chat");
  const [searchTerm, setSearchTerm] = useState("");
  const [showTermHistory, setShowTermHistory] = useState(true);

  // Helper function to get the appropriate response based on user
  const getResponseText = () => {
    const personalizedMessage = `Hi guys, I will leverage this moment to speak a little bit about me...well as you know I am Renato Santos. 
    During my career, I worked in different industries and with different approaches to solving problems. So, I am flexible, innovative, and fast-paced to learn new things. 
    I feel free to explore new things and jump to another new technology whenever it is needed or I will explore it.
    I THINK SOLUTION IS MORE THAN TECHNOLOGIES - SO TECH IS TOOLS TO BE USED AND COMBINED TO ACHIEVE A SMART SOLUTION.
    Be an expert is good, I am an expert whenever I have been working for a long time with certain stuff, but I am always ready to explore new things, that´s my spirit. Sorry to stop your flow! 
    Go ahead, ask something to the doc!`;

    const defaultMessage =
      "Hello! I'm here to help you with your document. Ask me anything about it!";

    // Show personalized message only for specific users
    if (
      authState.user &&
      (authState.user.email === "demo@demo.com" ||
        authState.user.email === "admin@admin.com")
    ) {
      return personalizedMessage;
    }

    return defaultMessage;
  };

  const result = state.results.filter((r) => r.documentId == documentId);
  const hasResults = result.length > 0;

  useEffect(() => {
    if (hasResults) {
      const currentResult = result[0];

      // Only restore state if we have a result and the mode matches the result type
      if (currentResult) {
        const isChatResult =
          currentResult.response && currentResult.response.length > 0;
        const isSearchResult =
          currentResult.pages && currentResult.pages.length > 0;

        if (
          (mode === "chat" && isChatResult) ||
          (mode === "pages" && isSearchResult)
        ) {
          setPages(currentResult.pages);
          setPriviousTerm(currentResult.term);

          if (searchTerm === "" && showTermHistory)
            setSearchTerm(currentResult.term);
        }
      }
    }
  }, [hasResults, result, mode, searchTerm, showTermHistory]);

  useEffect(() => {
    if (
      !id ||
      isNaN(parseInt(id, 10)) ||
      docState.documents.filter((doc) => doc.id == documentId).length === 0
    ) {
      navigate("/dashboard");
    }
  }, [id, navigate, docState]);

  const doc = docState.documents.filter((doc) => doc.id == documentId)[0];
  const documentName = doc?.title;

  const notImplemented = () => {
    alert(
      "It was not integrated on UI yet, please see it working on REST API by Swagger.",
    );
  };

  const handleChatSearchClick = () => {
    dispatch(
      chatRequest({
        documentId,
        mode,
        term: searchTerm,
      }),
    );
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
          <Box sx={{ textAlign: "center", mb: 4 }}>
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
              {mode === "chat" ? "Chat with Document" : "Search in Document"}
            </Typography>

            {/* Document Info */}
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <Stack spacing={2}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#1f2937",
                    fontWeight: 600,
                    fontSize: "1.3rem",
                  }}
                >
                  {documentName}
                </Typography>

                <Stack
                  direction="row"
                  spacing={3}
                  alignItems="center"
                  justifyContent="center"
                  flexWrap="wrap"
                  useFlexGap
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: "#f3e8ff",
                        color: "#9333ea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SearchPageIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", fontWeight: 500 }}
                    >
                      {doc?.type?.toUpperCase() || "PDF"}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: "#f0f9ff",
                        color: "#0284c7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ChatIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", fontWeight: 500 }}
                    >
                      {doc?.pages || 0} pages
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      sx={{
                        p: 0.5,
                        borderRadius: 1,
                        backgroundColor: "#f0fdf4",
                        color: "#16a34a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <BotIcon sx={{ fontSize: 16 }} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#6b7280", fontWeight: 500 }}
                    >
                      AI Ready
                    </Typography>
                  </Stack>
                </Stack>

                {doc?.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      fontStyle: "italic",
                      mt: 1,
                    }}
                  >
                    {doc.description}
                  </Typography>
                )}
              </Stack>
              <Box sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => notImplemented()}
                  sx={{
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                    },
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 30,
                    fontSize: "0.95rem",
                  }}
                >
                  Download Full Document
                </Button>
              </Box>
            </Paper>
          </Box>

          {/* Mode Toggle */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: 2,
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            <Stack spacing={2}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value as ChatMode);
                    // Reset previous state when switching modes
                    setPages([]);
                    setPriviousTerm("");
                    setSearchTerm("");
                    setShowTermHistory(false);
                    // Clear Redux state to prevent old results from showing
                    dispatch(clearResult());
                    dispatch(askQuestion());
                  }}
                  sx={{ justifyContent: "center" }}
                >
                  <FormControlLabel
                    value="chat"
                    control={
                      <Radio
                        sx={{
                          color: "#9333ea",
                          "&.Mui-checked": {
                            color: "#9333ea",
                          },
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ChatIcon sx={{ fontSize: 20, color: "#9333ea" }} />
                        <Typography sx={{ fontWeight: 500 }}>
                          AI Chat
                        </Typography>
                      </Stack>
                    }
                    sx={{ mr: 4 }}
                  />
                  <FormControlLabel
                    value="pages"
                    control={
                      <Radio
                        sx={{
                          color: "#9333ea",
                          "&.Mui-checked": {
                            color: "#9333ea",
                          },
                        }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <SearchPageIcon
                          sx={{ fontSize: 20, color: "#0284c7" }}
                        />
                        <Typography sx={{ fontWeight: 500 }}>
                          Search Pages
                        </Typography>
                      </Stack>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {/* Search Input */}
              <TextField
                fullWidth
                placeholder={
                  mode === "chat"
                    ? "Ask something about this document..."
                    : "Search for terms across all pages..."
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowTermHistory(false);
                  dispatch(askQuestion());
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

              {/* Action Button */}
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleChatSearchClick}
                  startIcon={mode === "chat" ? <BotIcon /> : <SearchIcon />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #9333ea 0%, #0284c7 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #0369a1 100%)",
                    },
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  {mode === "chat" ? "Start Chat" : "Search Pages"}
                </Button>
              </Box>
            </Stack>
          </Paper>

          {/* AI Generated Text */}
          {mode === "chat" && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                maxWidth: "900px",
                margin: "0 auto",
                position: "relative",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor: "#f3e8ff",
                    color: "#9333ea",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BotIcon sx={{ fontSize: 20 }} />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "#1f2937" }}
                >
                  AI Assistant
                </Typography>
              </Stack>

              <Box
                sx={{
                  backgroundColor: "#f9fafb",
                  borderRadius: 1.5,
                  p: 2,
                  border: "1px solid #e5e7eb",
                }}
              >
                <MarkdownTypewriterNoCursor
                  text={response || getResponseText()}
                  speed={25}
                />
              </Box>
            </Paper>
          )}

          <Loading isLoading={isLoading}></Loading>

          {/* Results Summary */}
          {pages.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
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
                justifyContent="center"
              >
                <Chip
                  icon={mode === "chat" ? <BotIcon /> : <SearchIcon />}
                  label={`${pages.length} page${pages.length !== 1 ? "s" : ""} found`}
                  sx={{
                    backgroundColor: mode === "chat" ? "#f3e8ff" : "#f0f9ff",
                    color: mode === "chat" ? "#9333ea" : "#0284c7",
                    border: `1px solid ${mode === "chat" ? "#e9d5ff" : "#bae6fd"}`,
                    fontWeight: 500,
                  }}
                />
                {priviousTerm && (
                  <Chip
                    label={
                      mode === "chat"
                        ? `Related to: "${priviousTerm}"`
                        : `Matching: "${priviousTerm}"`
                    }
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
            </Paper>
          )}
          {/* Results Grid */}
          {pages.length > 0 ? (
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                maxWidth: "900px",
                margin: "0 auto",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  backgroundColor: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                  p: 1.5,
                }}
              >
                <Stack direction="row" spacing={3} alignItems="center">
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      minWidth: "80px",
                      fontSize: "0.85rem",
                    }}
                  >
                    Page
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      flex: 1,
                      fontSize: "0.85rem",
                    }}
                  >
                    Content
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#1f2937",
                      minWidth: "100px",
                      textAlign: "center",
                      fontSize: "0.85rem",
                    }}
                  >
                    Actions
                  </Typography>
                </Stack>
              </Box>

              {/* Results */}
              {pages.map((res, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2.5,
                    borderBottom:
                      index < pages.length - 1 ? "1px solid #e5e7eb" : "none",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
                  }}
                >
                  <Stack direction="row" spacing={4} alignItems="flex-start">
                    <Box sx={{ minWidth: "80px" }}>
                      <Chip
                        label={`Page ${res.pageNumber}`}
                        size="small"
                        sx={{
                          backgroundColor: "#f3e8ff",
                          color: "#9333ea",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#4b5563",
                          lineHeight: 1.5,
                          backgroundColor: "#f9fafb",
                          p: 1.5,
                          borderRadius: 1.5,
                          border: "1px solid #e5e7eb",
                          fontSize: "0.85rem",
                        }}
                      >
                        {mode !== "chat" ? (
                          <Highlighter
                            highlightClassName="bg-yellow-200"
                            searchWords={[...searchTerm.split(" ")]}
                            autoEscape={true}
                            textToHighlight={
                              res.content.length > limitText
                                ? `${res.content.substring(0, limitText)}...`
                                : res.content
                            }
                          />
                        ) : (
                          <span>
                            {res.content.length > limitText
                              ? `${res.content.substring(0, limitText)}...`
                              : res.content}
                          </span>
                        )}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: "100px", textAlign: "center" }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => notImplemented()}
                        sx={{
                          borderColor: "#9333ea",
                          color: "#9333ea",
                          "&:hover": {
                            borderColor: "#7c3aed",
                            backgroundColor: "#f3e8ff",
                          },
                          fontSize: "0.75rem",
                          py: 0.5,
                          px: 1.5,
                        }}
                      >
                        Download
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Paper>
          ) : (
            mode === "pages" &&
            filtered &&
            pages.length === 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mb: 3,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 2,
                  maxWidth: "900px",
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ color: "#6b7280" }}>
                  No results found
                </Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af", mt: 1 }}>
                  Try adjusting your search terms or try a different query.
                </Typography>
              </Paper>
            )
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ChatDoc;
