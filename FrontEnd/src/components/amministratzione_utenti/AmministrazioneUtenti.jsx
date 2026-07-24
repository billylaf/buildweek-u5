import { useState } from "react";
import MyNavbar from "./MyNavbar";
import UserTable from "./ListaUtenti";
import { Container } from "react-bootstrap";

function AmministrazioneUtenti() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [refreshSignal, setRefreshSignal] = useState(0);

  const handleUserCreated = () => {
    setRefreshSignal((prev) => prev + 1);
  };

  return (
    <>
      <MyNavbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        onUserCreated={handleUserCreated}
      />
      <UserTable
        searchQuery={searchQuery}
        selectedRole={selectedRole}
        refreshSignal={refreshSignal}
      />
    </>
  );
}

export default AmministrazioneUtenti;
