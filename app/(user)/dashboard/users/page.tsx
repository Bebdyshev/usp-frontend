'use client';

import PageContainer from '@/components/layout/page-container';
import { UserManagement } from '@/app/(user)/dashboard/classes/_components/user-management';

export default function UsersManagementPage() {
  return (
    <PageContainer scrollable>
      <div className="py-4">
        <UserManagement />
      </div>
    </PageContainer>
  );
}
