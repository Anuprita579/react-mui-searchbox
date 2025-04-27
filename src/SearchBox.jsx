import React, { useState, useEffect, useRef } from 'react';
import { 
  TextField, 
  InputAdornment, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Box,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import Fuse from 'fuse.js';

const SearchBox = ({
  // Input props
  placeholder = 'Search...',
  value = '',
  autoFocus = false,
  className = '',
  type = 'text',
  
  // Data props
  data = [],
  filterKeys = [],
  
  // Style props
  inputFontColor = 'inherit',
  inputBorderColor = 'primary.main',
  inputFontSize = 16,
  inputHeight = 56,
  inputBackgroundColor = 'background.paper',
  dropDownHoverColor = 'action.hover',
  dropDownBorderColor = 'divider',
  chipColor = 'primary',
  
  // Icon props
  showSearchIcon = true,
  leftIcon = null,
  iconBoxSize = 24,
  
  // Function props
  onChange = () => {},
  onSelect = () => {},
  onFocus = () => {},
  onSuccess = () => {}, // New callback for success state
  
  // Feature flags
  debounce = true,
  throttleTime = 200,
  caseSensitive = false,
  fuzzy = false,
  sortResults = false,
  clearOnSelect = false,
  autoComplete = true,
  multipleChip = false, // New flag for multiple selection with chips
  
  // Success state
  successComponent = null,
  
  // Additional configs
  fuseConfigs = {},
  
  // Any other props
  ...rest
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredData, setFilteredData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // For multiple selection
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);

  // Setup fuse for fuzzy search
  const fuseOptions = {
    keys: filterKeys,
    threshold: 0.4,
    ignoreLocation: true,
    caseSensitive: caseSensitive,
    ...fuseConfigs
  };
  
  const fuse = new Fuse(data, fuseOptions);

  // Handle input changes with optional debounce
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (debounce) {
      setIsLoading(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        filterData(newValue);
        onChange(newValue);
        setIsLoading(false);
      }, throttleTime);
    } else {
      filterData(newValue);
      onChange(newValue);
    }
  };

  // Filter data based on input and search options
  const filterData = (searchTerm) => {
    if (!searchTerm) {
      setFilteredData([]);
      setIsOpen(false);
      return;
    }
    
    let results;
    
    if (fuzzy) {
      results = fuse.search(searchTerm).map(result => result.item);
      if (sortResults) {
        // Results are already sorted by score in fuse.js
      }
    } else {
      results = data.filter(item => {
        return filterKeys.some(key => {
          const itemValue = getNestedProperty(item, key);
          if (typeof itemValue === 'string') {
            return caseSensitive 
              ? itemValue.includes(searchTerm)
              : itemValue.toLowerCase().includes(searchTerm.toLowerCase());
          }
          return false;
        });
      });
    }
    
    // If using multipleChip, filter out already selected items
    if (multipleChip && selectedItems.length > 0) {
      // Filter out items that have already been selected
      const selectedIds = selectedItems.map(item => item.id);
      results = results.filter(item => !selectedIds.includes(item.id));
    }
    
    setFilteredData(results);
    setIsOpen(results.length > 0);
  };

  // Helper to get nested properties
  const getNestedProperty = (obj, path) => {
    const keys = Array.isArray(path) ? path : path.split('.');
    return keys.reduce((acc, key) => (acc && acc[key] !== undefined) ? acc[key] : null, obj);
  };

  // Handle item selection
  const handleSelect = (item) => {
    if (multipleChip) {
      // Add to selected items array
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      setInputValue(''); // Clear input for next selection
      setIsOpen(false);
      onSelect(newSelectedItems); // Pass all selected items
      
      // Call onSuccess with the latest selection
      onSuccess(item);
    } else {
      // Single selection behavior
      setSelected(item);
      onSelect(item);
      
      if (clearOnSelect) {
        setInputValue('');
      } else {
        // Find display value based on first filterKey
        const displayKey = filterKeys[0] || 'name';
        const displayValue = getNestedProperty(item, displayKey);
        setInputValue(displayValue || '');
      }
      
      setIsOpen(false);
      
      // Call onSuccess with the selected item
      onSuccess(item);
    }
  };

  // Handle removing a chip
  const handleRemoveChip = (itemToRemove, event) => {
    event.stopPropagation();
    const updatedItems = selectedItems.filter(item => item.id !== itemToRemove.id);
    setSelectedItems(updatedItems);
    onSelect(updatedItems); // Update parent with new selection
  };

  // Clear all selected items
  const handleClearAll = (e) => {
    if (e) e.stopPropagation();
    if (multipleChip) {
      setSelectedItems([]);
      onSelect([]);
    } else {
      setSelected(null);
      setInputValue('');
      onSelect(null);
    }
  };

  // Handle focus event
  const handleFocus = (e) => {
    onFocus(e);
    if (autoComplete && inputValue && filteredData.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up debounce timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Display selected chips for multiple selection
  const renderSelectedChips = () => {
    if (!selectedItems.length) return null;
    
    return (
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {selectedItems.map((item, index) => {
          const displayKey = filterKeys[0] || 'name';
          const chipLabel = getNestedProperty(item, displayKey);
          
          return (
            <Chip
              key={item.id || index}
              label={chipLabel}
              color={chipColor}
              size="small"
              onDelete={(e) => handleRemoveChip(item, e)}
              deleteIcon={<CancelIcon />}
            />
          );
        })}
        {selectedItems.length > 1 && (
          <Chip
            label="Clear All"
            variant="outlined"
            size="small"
            onClick={handleClearAll}
            sx={{ ml: 1 }}
          />
        )}
      </Stack>
    );
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%'
      }}
      ref={inputRef}
      className={`mui-search-component ${className}`}
    >
      {selected && successComponent && !multipleChip ? (
        successComponent(selected)
      ) : (
        <>
          {multipleChip && renderSelectedChips()}
          <TextField
            fullWidth
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            placeholder={placeholder}
            autoFocus={autoFocus}
            type={type}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {leftIcon || (showSearchIcon && <SearchIcon sx={{ fontSize: iconBoxSize }} />)}
                </InputAdornment>
              ),
              endAdornment: isLoading && (
                <InputAdornment position="end">
                  <CircularProgress size={20} color="inherit" />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiInputBase-root': {
                color: inputFontColor,
                backgroundColor: inputBackgroundColor,
                height: inputHeight,
                fontSize: inputFontSize,
                borderColor: inputBorderColor
              }
            }}
            {...rest}
          />
        </>
      )}

      {isOpen && filteredData.length > 0 && (
        <Paper 
          elevation={3}
          sx={{
            position: 'absolute',
            width: '100%',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
            mt: 0.5,
            borderColor: dropDownBorderColor
          }}
        >
          <List>
            {filteredData.map((item, index) => {
              // Use the first filter key as display field
              const displayKey = filterKeys[0] || 'name';
              const displayValue = getNestedProperty(item, displayKey);
              
              return (
                <ListItem
                  key={index}
                  onClick={() => handleSelect(item)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: dropDownHoverColor
                    }
                  }}
                >
                  <ListItemText primary={displayValue} />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
};

// Static method for external filtering
SearchBox.filter = (searchTerm, keys, options = {}) => {
  const { caseSensitive = false, fuzzy = false, sortResults = false } = options;
  
  if (fuzzy) {
    const fuseOptions = {
      keys: keys,
      threshold: 0.4,
      ignoreLocation: true,
      caseSensitive: caseSensitive
    };
    
    const fuse = new Fuse([], fuseOptions);
    
    return (data) => {
      fuse.setCollection(data);
      const results = fuse.search(searchTerm).map(result => result.item);
      return sortResults ? results : results;
    };
  }
  
  return (data) => {
    return data.filter(item => {
      return keys.some(key => {
        const itemValue = key.split('.').reduce((acc, k) => (acc && acc[k] !== undefined) ? acc[k] : null, item);
        if (typeof itemValue === 'string') {
          return caseSensitive 
            ? itemValue.includes(searchTerm)
            : itemValue.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  };
};

export default SearchBox;