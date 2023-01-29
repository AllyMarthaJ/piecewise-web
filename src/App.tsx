import React from 'react';
import './App.css';
import { evalPiecewise, texifyPiecewise } from './piecewise/piecewise';
import { doubleRamp } from './piecewise/doubleRamp';
import { abs } from './piecewise/abs';
import { MathJax, MathJaxContext } from "better-react-mathjax";

function App() {
  return (
    <header className="App-header">
        <p>
            The absolute value of 0 is {JSON.stringify(evalPiecewise(0, abs))}
        </p>
        <p>
            The absolute value of 1 is {JSON.stringify(evalPiecewise(1, abs))}
        </p>
        <p>
            The absolute value of -1 is {JSON.stringify(evalPiecewise(-1, abs))}
        </p>

        <MathJaxContext>
            <MathJax>
                {"$$" + texifyPiecewise(doubleRamp) + "$$"}
            </MathJax>
        </MathJaxContext>
    </header>
  );
}

export default App;
