import Control from './components/control';
import './chess.css';
import Vector from './components/vector';
import {CellModel, FieldModel, FieldState} from './chess-model';



const initialField = [
  'lneqkenl',
  'pppppppp',
  '        ',
  '        ',
  '        ',
  '        ',
  'PPPPPPPP',
  'LNEQKENL',
];


class CellView extends Control{
  public onClick: ()=>void;
  private fig:Control;
  constructor(parentNode: HTMLElement, className:string) {
    super(parentNode, 'div', className);
    this.fig = new Control(this.node);
    this.node.onclick = ()=>{
      this.onClick();
    }
  }

  select(state:boolean){
    if (state){
      this.node.classList.add('cell__selected');
    } else {
      this.node.classList.remove('cell__selected');
    }
  }

  allow(state:boolean){
    if (state){
      this.node.classList.add('cell__allowed');
    } else {
      this.node.classList.remove('cell__allowed');
    }
  }

  refresh(state:CellModel){
    this.styleFigure(state);
    if (!state.figure){ 
      //this.node.textContent = '';
      return; 
    }
    //this.node.textContent = state.figure.type;
    if (state.figure.color == 0){
      this.node.classList.add('cell__figureBlack');
      this.node.classList.remove('cell__figureWhite');
    } else {
      this.node.classList.add('cell__figureWhite');
      this.node.classList.remove('cell__figureBlack');
    }
    

  }

  styleFigure(state:CellModel){
    if (state.figure && state.figure.type && state.figure.type !==' '){
      this.fig.node.className = (`chess_fig chess__${state.figure.color?'b':'w'}${state.figure.type}`);  
    } else {
      this.fig.node.className = '';
    }
  }
}

class FieldController{
  private model:FieldModel;
  constructor(model:FieldModel){
    this.model = model;
  }

  cellClickHandler(cells:Array<CellView>, cell:CellView, pos:Vector){

  }
}

class FieldView extends Control{
  private cells:Array<CellView> = [];
  private model: FieldModel = new FieldModel();
  private controller: FieldController = new FieldController(this.model);
  //private selectedX:number=null;
  //private selectedY:number=null;
  private selectedCell:CellModel = null;

  constructor(parentNode: HTMLElement, initialState:Array<string>) {
    super(parentNode);
    for (let i=0; i<8; i++){
      let row = new Control(this.node, 'div', 'row');
      for (let j=0; j<8; j++){
        let cell = new CellView(row.node, (j%2 && i%2) || (!(j%2) && !(i%2)) ? 'cell cell__light': 'cell cell__dark');
        cell.onClick=()=>{
          let cellPos = this.getCellPosition(this.selectedCell);
          if (cellPos && cellPos.x === i && cellPos.y===j){  
            this.selectedCell = null;
            this.setSelection(null);
            this.setAllows([]);
          } else {
            if (this.selectedCell){
              let cellPos = this.getCellPosition(this.selectedCell);
              this.model.move(cellPos.x, cellPos.y, i, j);
            }
            this.setSelection(cell);
            this.selectedCell = this.model.state[i][j];
          }

          if (this.selectedCell && this.selectedCell.figure){
            let cellPos = this.getCellPosition(this.selectedCell);
            let allowed = this.model.getAllowed(this.model.state, cellPos.x, cellPos.y);
            this.setAllows(allowed.map(it=>new Vector(it.x, it.y)));
          } else {
            this.setAllows([]);
          }
          
        }
        this.cells.push(cell);
      }
    }
    this.model.onChange.add((state)=>this.refresh(state));
    this.model.setFromStrings(initialState);
  }

  cellClickHandler(){

  }

  refresh(state:FieldState){
    this.forEachCell((cell, pos)=>{
      cell.refresh(state[pos.x][pos.y]);
    });
  }

  setSelection(selection:CellView){
    this.forEachCell((cell)=>{
      if (selection && selection === cell){
        cell.select(true);
      } else {
        cell.select(false);
      }
    })
  }

  setAllows(selection:Array<Vector>){
    this.forEachCell((cell, pos)=>{
      let isAllowed = selection.findIndex(ax=>ax.x === pos.x && ax.y === pos.y) === -1 ? false: true;
      if (isAllowed){
        cell.allow(true);
      } else {
        cell.allow(false);
      }
    })
  }

  forEachCell(callback:(cell:CellView, position:Vector)=>void){
    this.cells.forEach((it, i)=>{
      let x = Math.floor(i / 8);
      let y = i % 8;
      callback(it, new Vector(x, y));
    });    
  }

  getCellPosition(cell:CellModel):Vector{
    let res = null;
    if (cell === null) {
      return null;
    }
    this.forEachCell((currentCell, pos)=>{
      if (this.model.getCellAt(this.model.state, pos) == cell){
        res = pos;
      }
    });
    return res;
  }
}

class Chess {
  constructor(parentNode:HTMLElement) {
    new FieldView(parentNode, initialField);  
  }
}

export default Chess;