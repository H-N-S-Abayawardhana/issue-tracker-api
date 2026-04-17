/**
 * Seed script — run once to populate demo data.
 * Usage: npx tsx src/db/seed.ts
 *
 * All demo users have password: Password123!
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';
import { User }  from '../models/user.model';
import { Issue } from '../models/issue.model';

async function seed(): Promise<void> {
  const uri = process.env['MONGO_URI'];
  if (!uri) { console.error('MONGO_URI not set'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Issue.deleteMany({});

  const hash = await bcrypt.hash('Password123!', 10);

  // Create users
  const [alice, bob, carol] = await User.insertMany([
    { name: 'Alice Johnson', email: 'alice@example.com', password_hash: hash },
    { name: 'Bob Smith',     email: 'bob@example.com',   password_hash: hash },
    { name: 'Carol White',   email: 'carol@example.com', password_hash: hash },
  ]);

  // Create issues
  await Issue.insertMany([
    { title: 'Login page crashes on mobile',    description: 'On iOS Safari the page goes blank on submit.',         status: 'Open',        priority: 'Critical', severity: 'Critical', created_by: alice._id, assigned_to: bob._id   },
    { title: 'Dashboard charts not loading',    description: 'Bar chart widget shows spinner indefinitely.',          status: 'In Progress', priority: 'High',     severity: 'Major',    created_by: alice._id, assigned_to: bob._id   },
    { title: 'CSV export includes BOM chars',   description: 'Exported CSV files open with garbage chars in Excel.', status: 'Open',        priority: 'Medium',   severity: 'Minor',    created_by: bob._id,   assigned_to: null      },
    { title: 'Improve search performance',      description: 'Queries take >3s on large datasets.',                  status: 'In Progress', priority: 'High',     severity: 'Major',    created_by: bob._id,   assigned_to: alice._id },
    { title: 'Password reset email not sent',   description: 'Forgot-password flow silently fails.',                 status: 'Open',        priority: 'Critical', severity: 'Critical', created_by: carol._id, assigned_to: alice._id },
    { title: 'Update npm dependencies',         description: 'Several packages are >6 months out of date.',          status: 'Resolved',    priority: 'Low',      severity: 'Minor',    created_by: alice._id, assigned_to: null      },
    { title: 'Add dark mode support',           description: 'Users requesting a dark theme in settings.',           status: 'Open',        priority: 'Medium',   severity: null,       created_by: bob._id,   assigned_to: null      },
    { title: 'Pagination breaks at page 2',     description: 'Clicking page 2 returns empty results.',               status: 'Closed',      priority: 'High',     severity: 'Major',    created_by: carol._id, assigned_to: bob._id   },
    { title: '404 page missing branding',       description: 'Not-found page uses default browser styling.',         status: 'Resolved',    priority: 'Low',      severity: null,       created_by: alice._id, assigned_to: null      },
    { title: 'Sidebar collapses unexpectedly',  description: 'On 1280px screens the sidebar hides on route change.', status: 'Open',        priority: 'Medium',   severity: 'Minor',    created_by: bob._id,   assigned_to: carol._id },
  ]);

  console.log('✅  Seed complete — 3 users, 10 issues');
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
