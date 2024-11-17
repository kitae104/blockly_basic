import * as Blockly from 'blockly/core';

class CustomConstantProvider extends Blockly.blockRendering.ConstantProvider {
    constructor() {
        super();

        this.NOTCH_WIDTH = 20;
        this.NOTCH_HEIGHT = 10;
        this.CORNER_RADIUS = 2;
        this.TAB_HEIGHT = 8;
    }

    /**
    * @override
    */
    init() {        
        super.init();        
        this.RECT_PREV_NEXT = this.makeRectangularPreviousConn();
        this.RECT_INPUT_OUTPUT = this.makeRectangularInputConn();
    }

    /**
    * @override
    */
    shapeFor(connection) {
        const checks = connection.getCheck();
        switch (connection.type) {
            case Blockly.INPUT_VALUE:
            case Blockly.OUTPUT_VALUE:
                if (checks && checks.includes('Number')) {
                    return this.RECT_INPUT_OUTPUT;
                }
                if (checks && checks.includes('String')) {
                    return this.RECT_INPUT_OUTPUT;
                }
                return this.PUZZLE_TAB;
            case Blockly.PREVIOUS_STATEMENT:
            case Blockly.NEXT_STATEMENT:
                return this.NOTCH;                
            default:
                throw Error('Unknown connection type');
        }
    }    

    makeRectangularPreviousConn() {
        const width = this.NOTCH_WIDTH;
        const height = this.NOTCH_HEIGHT;    
        
        function makeMainPath(dir) {
            return Blockly.utils.svgPaths.line([
                Blockly.utils.svgPaths.point(0, height),
                Blockly.utils.svgPaths.point(dir * width, 0),
                Blockly.utils.svgPaths.point(0, -height),
            ]);
        }
        const pathLeft = makeMainPath(1);
        const pathRight = makeMainPath(-1);
    
        return {
            width: width,
            height: height,
            pathLeft: pathLeft,
            pathRight: pathRight,
        };
    }

    makeRectangularInputConn() {
        const width = this.TAB_WIDTH;
        const height = this.TAB_HEIGHT;    
        
        function makeMainPath(dir) {
            return Blockly.utils.svgPaths.line([
                Blockly.utils.svgPaths.point(-width, 0),
                Blockly.utils.svgPaths.point(0, dir * height),
                Blockly.utils.svgPaths.point(width, 0),
            ]);
        }
        const pathUp = makeMainPath(-1);
        const pathDown = makeMainPath(1);
    
        return {
            width: width,
            height: height,
            pathUp: pathUp,
            pathDown: pathDown,
        };
    }
}

export class CustomRenderer extends Blockly.blockRendering.Renderer {
    constructor() {
        super();
    }  
    
    makeConstants_() {
        return new CustomConstantProvider();
    }
}  

// 새로운 렌더러를 등록
Blockly.blockRendering.register('custom_renderer', CustomRenderer);