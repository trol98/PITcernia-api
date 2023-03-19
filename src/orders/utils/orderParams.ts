import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

class OrderParams {
  @IsBoolean()
  // class-validator treats all strings as true even 'false'
  @Transform(({ value }) => {
    return value === 'true';
  })
  isActive: boolean;
}
export default OrderParams;
