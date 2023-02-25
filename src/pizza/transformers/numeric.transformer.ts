import { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformer implements ValueTransformer {
  to(data: number): string {
    return data.toString();
  }
  from(data: string): number {
    return parseFloat(data);
  }
}
