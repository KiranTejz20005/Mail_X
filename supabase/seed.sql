-- Run AFTER you sign up.
-- Option 1: replace YOUR_USER_ID_HERE with your actual UUID.
-- Option 2: leave it as-is and the script will use the first user found in auth.users.

do $$
declare
  target_user_id uuid := nullif('YOUR_USER_ID_HERE', 'YOUR_USER_ID_HERE')::uuid;
begin
  if target_user_id is null then
    select id into target_user_id
    from auth.users
    order by created_at asc
    limit 1;
  end if;

  if target_user_id is null then
    raise notice 'No auth.users row found. Create a user first, then rerun seed.sql.';
    return;
  end if;

  insert into public.emails (user_id, email_id, "from", subject, content, category)
  select
    target_user_id,
    format('seed-%s', gs),
    case category
      when 'urgent' then (array[
        'Google Security <security@google.com>',
        'Stripe Alerts <alerts@stripe.com>',
        'AWS Trust & Safety <no-reply@amazonaws.com>',
        'GitHub Security <noreply@github.com>',
        'Bank Fraud Team <fraud@bank.com>'
      ])[((gs - 1) % 5) + 1]
      when 'positive' then (array[
        'Product Hunt <team@producthunt.com>',
        'Notion Team <team@notion.so>',
        'Figma <hello@figma.com>',
        'Canva <news@canva.com>',
        'MailX Team <hello@mailx.com>'
      ])[((gs - 1) % 5) + 1]
      when 'calendar' then (array[
        'Calendar <calendar-notify@google.com>',
        'Zoom Scheduler <no-reply@zoom.us>',
        'Meet Notifications <noreply@google.com>',
        'Teams Calendar <noreply@teams.microsoft.com>',
        'Calendly <updates@calendly.com>'
      ])[((gs - 1) % 5) + 1]
      else (array[
        'MongoDB Team <team@mongodb.com>',
        'Vercel Updates <support@vercel.com>',
        'Linear <updates@linear.app>',
        'Supabase <news@supabase.com>',
        'OpenAI <updates@openai.com>'
      ])[((gs - 1) % 5) + 1]
    end as "from",
    case category
      when 'urgent' then (array[
        'Security alert: new sign-in',
        'Payment issue requires attention',
        'Suspicious activity detected',
        'Action required: verify your account',
        'Invoice overdue for payment'
      ])[((gs - 1) % 5) + 1]
      when 'positive' then (array[
        'Welcome to the team',
        'Your subscription is active',
        'Great news about your account',
        'Feature launch recap',
        'Thanks for being with us'
      ])[((gs - 1) % 5) + 1]
      when 'calendar' then (array[
        'Meeting scheduled for tomorrow',
        'Calendar invite: product review',
        'Updated event time',
        'Reminder: team sync today',
        'Your interview is confirmed'
      ])[((gs - 1) % 5) + 1]
      else (array[
        'Voyage AI is joining MongoDB',
        'Weekly product update',
        'Release notes and improvements',
        'New docs published',
        'Service status update'
      ])[((gs - 1) % 5) + 1]
    end as subject,
    case category
      when 'urgent' then (array[
        'We noticed unusual activity on your account. Please review recent sign-ins and reset your password if needed.',
        'Your recent payment could not be processed. Please update your billing details to avoid service interruption.',
        'A login from a new device was detected. If this was not you, secure your account immediately.',
        'We need you to verify this activity within the next 24 hours to keep your account secure.',
        'An invoice is past due. Please make payment or contact support to prevent late fees.'
      ])[((gs - 1) % 5) + 1]
      when 'positive' then (array[
        'Welcome aboard. Your workspace has been configured and you are ready to explore the latest features.',
        'Your plan is now active. Enjoy premium tools, faster workflows, and priority support.',
        'Thanks for choosing us. Your account is in great shape and everything is working smoothly.',
        'We shipped several improvements this week that should make your workflow faster and easier.',
        'We appreciate your continued support. Here are a few highlights from the past month.'
      ])[((gs - 1) % 5) + 1]
      when 'calendar' then (array[
        'This meeting is scheduled for tomorrow at 10:00 AM. Please confirm your attendance if the time needs to change.',
        'You have been invited to a product review session. The agenda and meeting link are attached.',
        'The event time has been updated. Please check your calendar for the new schedule.',
        'Reminder: your team sync starts in one hour. Join the meeting using the link below.',
        'Your interview has been confirmed. Please arrive a few minutes early and keep your calendar available.'
      ])[((gs - 1) % 5) + 1]
      else (array[
        'We are excited to share platform updates, performance improvements, and new integrations.',
        'Here is your weekly digest with the latest product changes and upcoming improvements.',
        'Release notes are now live with bug fixes, feature updates, and quality-of-life improvements.',
        'We published new documentation to help you get started faster and build with confidence.',
        'Status update: the service is operating normally and all systems are healthy.'
      ])[((gs - 1) % 5) + 1]
    end as content,
    category
  from generate_series(1, 100) as gs
  cross join lateral (
    select (array['urgent', 'positive', 'neutral', 'calendar', 'spam'])[((gs - 1) % 5) + 1] as category
  ) as picked
  on conflict (email_id) do nothing;
end $$;
