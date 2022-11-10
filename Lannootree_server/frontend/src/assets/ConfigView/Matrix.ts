class Matrix<T> {

  private _data: Array<T | null> = [];
  
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;

    this._data = new Array(this._width * this._height).fill(null);
  }

  public resize(width: number, height: number, shift: { col: number, row: number }): Matrix<T> {
    let newMatrix = new Matrix<T>(width, height);

    for (let col = 0; col < this._width; col++) {
      for (let row = 0; row < this._height; row++) {
        newMatrix.setValue(col + shift.col, row + shift.row, this.getValue(col, row));
      }
    }

    return newMatrix;
  }

  public getValue(col: number, row: number) : T | null {
    if (col < 0 || col >= this._width || row < 0 || row >= this._height) {
      console.error("Out of bounds read:" + `[${col}, ${row}]`);
      return null;
    }

    return this._data[row * this._width + col];
  }

  public setValue(col: number, row: number, value: T | null) {
    if (col < 0 || col >= this._width || row < 0 || row >= this._height) {
      console.error("Out of bounds write" + `[${col}, ${row}]`);
      return;
    }
    
    this._data[row * this._width + col] = value;
  }

  public dimention() {
    return [this._width, this._height];
  }

  public forEach(callbackfn: any) {
    this._data.forEach(callbackfn);
  }

  public toArray() {
    return this._data;
  }

}

export default Matrix;
