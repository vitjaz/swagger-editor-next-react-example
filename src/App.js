import "./App.css";
import SwaggerEditor from "@swagger-api/swagger-editor";
import "@swagger-api/swagger-editor/swagger-editor.css";

const url =
  "https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml";
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>My React App with Swagger editor</p>
        <SwaggerEditor url={url} />
      </header>
    </div>
  );
}

export default App;
