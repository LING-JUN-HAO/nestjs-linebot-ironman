import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { LineLoginModule } from 'src/line-login/line-login.module';

@Module({
  imports: [LineLoginModule],
  controllers: [UserController],
  providers: [UserService, SupabaseService],
  exports: [UserService],
})
export class UserModule {}
