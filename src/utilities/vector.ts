class Vector {
  public x: number;

  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  add(vector: Vector): Vector {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  sub(vector: Vector): Vector {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  scale(scaler: number): Vector {
    this.x *= scaler;
    this.y *= scaler;
    return this;
  }

  normalize(): Vector {
    const abs = this.abs();
    if (!Number.isNaN(abs) && abs !== 0) {
      this.scale(1 / abs);
    }
    return this;
  }

  abs(): number {
    return (this.x ** 2 + this.y ** 2) ** 0.5;
  }
}

export default Vector;
