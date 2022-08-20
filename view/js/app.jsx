const { useState } = React;
console.log(React);

const App = (props) => {
  const [text, setText] = useState("hello");

  return (
    <div>
      <h1>{text}</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
