import "./App.css";
import SwaggerEditor from "@swagger-api/swagger-editor";
import "@swagger-api/swagger-editor/swagger-editor.css";

const url =
  "https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml";
function App() {
  return (
    <SwaggerEditor url={url} />
  );
}

export default App;
