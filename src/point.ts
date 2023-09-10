export class Point {
    constructor(private readonly _x: number, private readonly _y: number) {}

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }
}