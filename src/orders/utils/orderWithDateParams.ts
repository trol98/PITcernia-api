import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate } from 'class-validator';

class OrderWithDateParams {
  @IsBoolean()
  // class-validator treats all strings as true even 'false'
  @Transform(({ value }) => {
    return value === 'true';
  })
  isActive: boolean;

  @Type(() => Date)
  @IsDate()
  readonly after: Date;

  @Type(() => Date)
  @IsDate()
  readonly before: Date;
}
export default OrderWithDateParams;
