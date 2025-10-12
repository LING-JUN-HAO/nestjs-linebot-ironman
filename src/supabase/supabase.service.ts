import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    const url = this.config.getOrThrow<string>('supabase.url');
    const key = this.config.getOrThrow<string>('supabase.serviceRoleKey');
    this.client = createClient(url, key, { auth: { persistSession: false } });
  }

  get db() {
    return this.client;
  }
}
