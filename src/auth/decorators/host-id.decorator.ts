import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const HostId = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;

  if (!user || !user.hostId) {
    throw new Error('HostId not found in request user');
  }

  return user.hostId;
});
