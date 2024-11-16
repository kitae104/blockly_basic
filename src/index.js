// import { blocks } from './blocks/text';
// import { forBlock } from './generators/javascript';
// import { javascriptGenerator } from 'blockly/javascript';

import * as Blockly from 'blockly';
import {blocks} from './blocks/json';
import {jsonGenerator} from './generators/json';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';

// Blockly로 블록과 생성기 등록
Blockly.common.defineBlocks(blocks);

// Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;

// const outputDiv = document.getElementById('output');

const blocklyDiv = document.getElementById('blocklyDiv');

const ws = Blockly.inject(blocklyDiv, {
    toolbox,
    grid: { spacing: 20, length: 3, colour: '#ccc', snap: true },
    move: {
        scrollbars: {
            horizontal: true,
            vertical: true,
        },
        drag: true,
        wheel: true,
    },
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2,
        pinch: true,
    },
    trashcan: true,
});

//======================================================
// 코드 실행 부분 - 코드생성기에 따라 이름 변경 확인 
//======================================================
const runCode = () => {
    const code = jsonGenerator.workspaceToCode(ws); // 명칭 변경 확인!!
    codeDiv.innerText = code;    
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
        e.isUiEvent ||
        e.type == Blockly.Events.FINISHED_LOADING ||
        ws.isDragging()
    ) {
        return;
    }
    runCode();
});
