import { Container } from "react-bootstrap";
import MyNavbar from "./MyNavbar";
import ListaUtenti from "./ListaUtenti";

const AmministrazioneUtenti = () => {
  return (
    <Container>
      <MyNavbar></MyNavbar>
      <ListaUtenti></ListaUtenti>
    </Container>
  );
};

export default AmministrazioneUtenti;
