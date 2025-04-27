import React, { useState } from "react";
import { Box, Typography, Chip, Alert } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { SearchBox } from './index';

const Demo = () => {
  const [basicSearchUser, setBasicSearchUser] = useState(null);
  const [fuzzySearchUser, setFuzzySearchUser] = useState(null);
  const [successCompUser, setSuccessCompUser] = useState(null);
  const [customStyledUser, setCustomStyledUser] = useState(null);
  const [multipleUsers, setMultipleUsers] = useState([]);
  const [successAlert, setSuccessAlert] = useState(null);

  const userData = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Manager" },
    { id: 4, name: "Emily Williams", email: "emily@example.com", role: "Developer" },
    { id: 5, name: "Michael Brown", email: "michael@example.com", role: "Designer" },
    { id: 6, name: "Sarah Miller", email: "sarah@example.com", role: "Manager" },
    { id: 7, name: "David Garcia", email: "david@example.com", role: "Developer" },
    { id: 8, name: "Lisa Martinez", email: "lisa@example.com", role: "Designer" },
    { id: 9, name: "James Rodriguez", email: "james@example.com", role: "Manager" },
    { id: 10, name: "Jennifer Wilson", email: "jennifer@example.com", role: "Developer" },
  ];

  // Handlers
  const handleClear = (e) => {
    e.stopPropagation();
    setSuccessCompUser(null);
    console.log("Cleared selected user");
  };

  // Success handlers
  const handleBasicSuccess = (user) => {
    showSuccessAlert(`Selected ${user.name} from Basic Search`);
    // Example navigation
    // navigate(`/user/${user.id}`);
  };

  const handleMultipleSuccess = (user) => {
    showSuccessAlert(`Added ${user.name} to the team`);
  };

  // Display success alert
  const showSuccessAlert = (message) => {
    setSuccessAlert(message);
    setTimeout(() => {
      setSuccessAlert(null);
    }, 3000);
  };

  const SuccessComponent = (item) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        bgcolor: "success.light",
        borderRadius: 1,
      }}
    >
      <PersonIcon sx={{ mr: 1 }} />
      <Typography variant="body1">
        Selected: <strong>{item.name}</strong> ({item.role})
      </Typography>
      <Chip
        label="Clear"
        size="small"
        onClick={handleClear}
        sx={{ ml: 2 }}
      />
    </Box>
  );

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center p-4">
      <p className="font-extrabold text-5xl text-white text-center p-4 mb-4">
        MUI Search Component Demo
      </p>

      {successAlert && (
        <div className="w-full max-w-2xl mb-4">
          <Alert severity="success" onClose={() => setSuccessAlert(null)}>
            {successAlert}
          </Alert>
        </div>
      )}

      <div className="grid-cols-1 md:grid-cols-2 grid gap-4 max-w-2xl w-full">
        <div className="bg-white p-4 rounded-lg">
          <p className="font-semibold text-lg"> Basic Search with onSuccess </p>
          <SearchBox
            placeholder="Search users..."
            data={userData}
            filterKeys={["name", "email"]}
            onSelect={(user) => setBasicSearchUser(user)}
            onSuccess={handleBasicSuccess}
            debounce={true}
            throttleTime={300}
          />
        </div>

        <div className="bg-white p-4 rounded-lg">
          <p className="font-semibold text-lg"> Fuzzy Search with Custom Icon </p>
          <SearchBox
            placeholder="Fuzzy search users..."
            data={userData}
            filterKeys={["name", "email", "role"]}
            onSelect={(user) => setFuzzySearchUser(user)}
            leftIcon={<PersonIcon />}
            showSearchIcon={false}
            fuzzy={true}
            sortResults={true}
            inputBorderColor="secondary.main"
            inputFontColor="secondary.dark"
          />
        </div>

        <div className="bg-white p-4 rounded-lg">
          <p className="font-semibold text-lg"> Search with Success Component </p>
          {successCompUser ? (
            <SuccessComponent {...successCompUser} />
          ) : (
            <SearchBox
              placeholder="Search and select a user..."
              data={userData}
              filterKeys={["name", "email"]}
              onSelect={(user) => setSuccessCompUser(user)}
            />
          )}
        </div>

        <div className="bg-white p-4 rounded-lg">
          <p className="font-semibold text-lg"> Custom Styled Search </p>
          <SearchBox
            placeholder="Custom styled search..."
            data={userData}
            filterKeys={["name"]}
            onSelect={(user) => setCustomStyledUser(user)}
            inputBackgroundColor="primary.light"
            inputFontColor="common.white"
            inputHeight={48}
            inputFontSize={14}
            dropDownHoverColor="primary.light"
          />
        </div>

        <div className="bg-white p-4 rounded-lg md:col-span-2">
          <p className="font-semibold text-lg"> Multiple Chip Selection </p>
          <SearchBox
            placeholder="Add team members..."
            data={userData}
            filterKeys={["name", "email", "role"]}
            onSelect={(users) => setMultipleUsers(users)}
            onSuccess={handleMultipleSuccess}
            multipleChip={true}
            chipColor="primary"
            fuzzy={true}
          />
          <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
            Selected {multipleUsers.length} team members
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Demo;