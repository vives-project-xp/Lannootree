class Matrix<T> {

  private _data: T[] = [];
  
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;

    this._data = new Array(width * height).fill(null);
  }

  public resize(width: number, height: number) {
    let newData: T[] = [];

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        newData.push(this.getValue(col, row) as T);
      }
    }

    this._width = width;
    this._height = height;

    this._data = newData;
  }

  public getValue(col: number, row: number) {
    if (col < 0 || col >= this._width || row < 0 || row >= this._height) {
      return null;
    }

    return this._data[row * this._width + col];
  }

  public setValue(col: number, row: number, value: T) {
    if (col < 0 || col >= this._width || row < 0 || row >= this._height) {
      return;
    }
    
    this._data[row * this._width + col] = value;
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }

}

export default Matrix;
