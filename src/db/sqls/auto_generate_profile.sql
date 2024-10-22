-- -- inserts a row into public.profiles
-- create function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer set search_path = ''
-- as $$
-- begin
--   insert into public.profiles (user_id, is_admin, additional_point, created_at, updated_at)
--   values (new.id, false, 0, now(), now());
--   return new;
-- end;
-- $$;

-- -- trigger the function every time a user is created
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute procedure public.handle_new_user();

-- -- delete a row from public.profiles
-- create function public.handle_deleted_user()
-- returns trigger
-- language plpgsql
-- security definer set search_path = ''
-- as $$
-- begin
--   delete from public.profiles where id=new.id;
--   return new;
-- end;
-- $$;

-- -- trigger the function every time a user is deleted
-- create trigger on_auth_user_deleted
--   after delete on auth.users
--   for each row execute procedure public.handle_deleted_user();
  

drop trigger "on_auth_user_created" on "auth"."users";
drop function public.handle_new_user;
drop trigger "on_auth_user_deleted" on "auth"."users";
drop function public.handle_deleted_user;
