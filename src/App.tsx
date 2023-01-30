import React from 'react';
import './App.css';
import { doubleRamp } from './piecewise/examples/doubleRamp';
import { abs } from './piecewise/examples/abs';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { evalPiecewise } from './piecewise/eval';
import { texifyPiecewise } from './piecewise/texify';
import { flattenPiecewise } from './piecewise/flatten';
import { _flattenedDoubleRamp } from './piecewise/tests/_flattenedDoubleRamp';

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
                {"$$" + texifyPiecewise(flattenPiecewise(_flattenedDoubleRamp)) + "$$"}
            </MathJax>
        </MathJaxContext>
    </header>
  );
}

export default App;
