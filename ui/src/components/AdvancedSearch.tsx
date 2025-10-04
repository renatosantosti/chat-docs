import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Stack,
  Collapse,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  DateRange as DateIcon,
  Description as DocIcon,
} from "@mui/icons-material";

interface AdvancedSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  onClear: () => void;
  totalResults?: number;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  onClear,
  totalResults,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({
    type: "",
    dateRange: "",
    sortBy: "recent",
  });

  const handleFilterChange = (filter: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filter]: value }));
  };

  const handleSearch = () => {
    onSearch();
  };

  const handleClear = () => {
    onClear();
    setFilters({ type: "", dateRange: "", sortBy: "recent" });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Stack spacing={2}>
        {/* Search Bar Principal */}
        <TextField
          fullWidth
          placeholder="Search documents by title, content, or keywords..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} size="small">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "grey.50",
            },
          }}
        />

        {/* Resultados e Filtros */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {searchTerm && (
              <Chip
                label={`"${searchTerm}"`}
                size="small"
                onDelete={handleClear}
                deleteIcon={<ClearIcon />}
              />
            )}
          </Stack>

          <Button
            startIcon={<FilterIcon />}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setExpanded(!expanded)}
            variant="outlined"
            size="small"
          >
            Advanced Filters
          </Button>
        </Stack>

        {/* Filtros Avançados */}
        <Collapse in={expanded}>
          <Box
            sx={{
              pt: 2,
              borderTop: "1px solid",
              borderColor: "grey.200",
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Document Type"
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="doc">Word Document</MenuItem>
                  <MenuItem value="txt">Text File</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  label="Date Range"
                  onChange={(e) =>
                    handleFilterChange("dateRange", e.target.value)
                  }
                >
                  <MenuItem value="">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <MenuItem value="recent">Most Recent</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="name">Name A-Z</MenuItem>
                  <MenuItem value="size">File Size</MenuItem>
                  <MenuItem value="pages">Page Count</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{ ml: "auto" }}
              >
                Apply Filters
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </Stack>
    </Paper>
  );
};

export default AdvancedSearch;
